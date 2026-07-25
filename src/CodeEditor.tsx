import { Editor } from "@monaco-editor/react";
import type { PortInterface } from "./nodes/Port";
import type * as Monaco from "monaco-editor";
import { useEffect, useRef } from "react";

interface CodeEditorProps {
    code: string;
    ports: PortInterface[];
    onChange: (code: string) => void;
}





export default function CodeEditor({
    code,
    ports,
    onChange
}: CodeEditorProps) {

    const monacoRef = useRef<typeof Monaco | null>(null);
    const providerRef = useRef<Monaco.IDisposable | null>(null);
    
    const handleEditorMount = (
        editor: Monaco.editor.IStandaloneCodeEditor,
        monaco: typeof Monaco
    ) => {
    
        monacoRef.current = monaco;
    
    
        providerRef.current = monaco.languages.registerCompletionItemProvider(
            "javascript",
            {
                provideCompletionItems(model, position) {

                    const word = model.getWordUntilPosition(position);
                
                    const range = {
                        startLineNumber: position.lineNumber,
                        endLineNumber: position.lineNumber,
                        startColumn: word.startColumn,
                        endColumn: word.endColumn
                    };
                
                    const suggestions = [
                        ...ports.map(port => ({
                            label: port.name,
                            kind: monaco.languages.CompletionItemKind.Variable,
                            insertText: port.name,
                            documentation: `Input: ${port.type}`,
                            range: range
                        }))
                    ];
                
                
                    return {
                        suggestions
                    };
                }
            }
        );
    };

    useEffect(() => {
        return () => {
            providerRef.current?.dispose();
        };
    }, []);


    return (
        <Editor
            height="400px"
            language="javascript"
            theme="vs-dark"
            value={code}
            onChange={(value) => onChange(value ?? "")}
            onMount={handleEditorMount}
        />
    );
}