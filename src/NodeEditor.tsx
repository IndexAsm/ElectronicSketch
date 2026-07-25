import type { GenericNode } from "./nodes/GenericNode";

import "./NodeEditor.css";
import { useState, useEffect } from "react";
import CodeEditor from "./CodeEditor";
import PortEditor from "./PortEditor";

interface NodeEditorProps {
    node: GenericNode | null;
    onClose: () => void;
    onSave: (node: GenericNode) => void;
}

export default function NodeEditor({
    node,
    onClose,
    onSave
}: NodeEditorProps) {

    if (!node)
        return null;

    const [editedNode, setEditedNode] = useState(node);

    const [editPorts, setEditPorts] = useState(false);
    

    return (
        <>
            <div className="node-editor">
                <h2>
                    <input
                        value={editedNode.data.name}
                        onChange={(e) => {
                            setEditedNode({
                                ...editedNode,
                                data: {
                                    ...editedNode.data,
                                    name: (e.target as HTMLInputElement).value
                                }
                            })
                        }}
                    />
                </h2>
                <table style={{ width: "100%" }}>
                    <tr>
                        <td style={{ width: "50%" }}>
                            <h2>
                                Inputs
                            </h2>
                        </td>
                        <td style={{ width: "50%" }}>
                            <h2>
                                Outputs
                            </h2>
                        </td>
                    </tr>
                    <tr>
                        <td>

                            <ul>
                                {editedNode.data.ports.map((input, i) => {
                                    if (input.direction === "in")
                                    return (
                                        <li key={input.id} style={{ display: "flex", alignItems: "center" }}>
                                            <h3 style={{ width: "50%"}}>
                                                {input.name}
                                            </h3>
                                            <h3 style={{ width: "50%"}}> 
                                                Type: {input.type}
                                            </h3>


                                        </li>
                                )})}
                            </ul>
                        </td>
                        <td>
                            <ul>
                                {editedNode.data.ports.map((output, i) => {
                                    if (output.direction === "out")
                                    return (

                                        <li key={output.id} style={{ display: "flex", alignItems: "center" }}>
                                            <h3 style={{ width: "50%"}}>
                                                {output.name}
                                            </h3>
                                            <h3 style={{ width: "50%"}}> 
                                                Type: {output.type}
                                            </h3>
                                        </li>
                                )})}
                            </ul>
                        </td>
                    </tr>
                </table>
                <button className="button-edit" style={{margin: "10px"}} onClick={() => {
                    setEditPorts(true);
                }}>Edit IO</button>

                <CodeEditor code={editedNode.data.code} ports={editedNode.data.ports} onChange={(newCode) => {
                    setEditedNode({
                        ...editedNode,
                        data: {
                            ...editedNode.data,
                            code: newCode
                        }
                    });
                }}>

                </CodeEditor>

                <div className="button-div">
                    <button className="button-cancel" onClick={onClose}>
                        Cancel
                    </button>

                    <button className="button-save" onClick={() => onSave(editedNode)}>
                        Save
                    </button>
                </div>

            </div>
            <PortEditor
                ports={editedNode.data.ports} 
                onClose={() => {
                    setEditPorts(false);
                }}
                onSave={(newPorts) => {
                    setEditedNode({
                        ...editedNode,
                        data: {
                            ...editedNode.data,
                            ports: newPorts
                        }
                    });
                    setEditPorts(false);

                }}
                editPorts={editPorts}
            >

            </PortEditor>
        </>
    );
}