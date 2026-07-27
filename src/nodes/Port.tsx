import { Handle, Position } from "@xyflow/react";
import "./Port.css"

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
}

export default function Port({ port }: PortProps) {
    const position = {
        left: Position.Left,
        right: Position.Right,
        top: Position.Top,
        bottom: Position.Bottom,
    }[port.side];


    return (
        <div className="port">
            {port.direction !== "out" && (
                <Handle
                    type="target"
                    position={position}
                    id={`${port.id}-in`}
                />
            )}

            {port.direction !== "in" && (
                <Handle
                    type="source"
                    position={position}
                    id={`${port.id}-out`}
                />
            )}

            <div className={`port-name port-name-${port.side}`}>
                {port.name}
            </div>
        </div>
    );
}



interface PortContainerProps {
    side: "top" | "bottom" | "left" | "right";
    ports: PortInterface[];
}

export function PortContainer({ side, ports }: PortContainerProps) {
    return (
        <div className={`ports ports-${side}`}>
            {ports.map(port => (
                <div key={port.id} className={`port port-${side}`}>
                    <Port port={port} />
                </div>
            ))}
        </div>
    );
}