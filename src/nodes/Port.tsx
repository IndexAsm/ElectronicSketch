import { Handle, Position } from "@xyflow/react";

export type PortType = "number" | "string" | "boolean";

export interface PortInterface {
    id: string;
    name: string;
    side: "left" | "right" | "top" | "bottom";
    type: PortType;
    direction: "in" | "out" | "io";
}

interface PortProps {
    port: PortInterface;
    type: string;
    length: number;
    i: number;
}

export default function Port({ port, type, length, i }: PortProps) {


    if (port.side === "top"){
        return (
            <div>
                <Handle
                    key={port.id}
                    id={port.id}
                    type="target"
                    position={Position.Top}
                    style={{
                        top: (70 / length) * i + 40,
                    }}
                />
                <div style={{ position: "absolute", top: "10px", left: (70 / length) * i + 30 }}>{port.name}</div>
            </div>
        );
    } else if (port.side === "right"){
        return (
            <div>
                <Handle
                    key={port.id}
                    id={port.id}
                    type="source"
                    position={Position.Right}
                    style={{
                        top: (70 / length) * i + 40,
                    }}
                />
                <div style={{ position: "absolute", right: "10px", top: (70 / length) * i + 30 }}>{port.name}</div>
            </div>
        );
    } else if (port.side === "left"){
        return (
            <div>
                <Handle
                    key={port.id}
                    id={port.id}
                    type="source"
                    position={Position.Left}
                    style={{
                        top: (70 / length) * i + 40,
                    }}
                />
                <div style={{ position: "absolute", left: "10px", top: (70 / length) * i + 30 }}>{port.name}</div>
            </div>
        );
    } else if (port.side === "bottom"){
        return (
            <div>
                <Handle
                    key={port.id}
                    id={port.id}
                    type="source"
                    position={Position.Bottom}
                    style={{
                        top: (70 / length) * i + 40,
                    }}
                />
                <div style={{ position: "absolute", bottom: "10px", left: (70 / length) * i + 30 }}>{port.name}</div>
            </div>
        );
    }
    
}