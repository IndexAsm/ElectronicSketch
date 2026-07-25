import { type NodeProps, type Node } from "@xyflow/react";
import type { PortInterface } from "./Port";
import Port from "./Port";

import "./GenericNode.css";



export interface GenericNodeData {
    [key: string]: unknown;
    name: string;
    ports: PortInterface[];
    properties?: Record<string, unknown>;
    code?: string;
}

export type GenericNode = Omit<Node, "data"> & {
    id: string;
    data: GenericNodeData;
};


export default function genericNode(
    { data }: NodeProps<GenericNode>
) {

    const topPorts = data.ports.filter(p => p.side === "top");;
    const bottomPorts = data.ports.filter(p => p.side === "bottom");
    const leftPorts = data.ports.filter(p => p.side === "left");
    const rightPorts = data.ports.filter(p => p.side === "right");

    return (
        <div className="generic-node" style={{ padding: "10px", height: 40 +  data.ports.length * 20 + "px", width: "150px", position: "relative" }}>
            
            <div style={{ width:"100%"}}>
            {topPorts.map((port, i) =>
                <Port port={port} type="input" length={topPorts.length} i={i} />
            )}
            </div>
            <div style={{ width: "100%", height: "35px", textAlign: "center"}}>{data.name}</div>
            <div style={{ width:"15%", float: "left"}}>
                {leftPorts.map((port, i) =>
                    <Port port={port} type="input" length={leftPorts.length} i={i} />
                )}
            </div>
            <div style={{ width:"15%", float: "right"}}>
                {rightPorts.map((port, i) =>
                    <Port port={port} type="input" length={rightPorts.length} i={i} />
                )}
            </div>
            <div style={{ width:"100%", bottom: 0, position: "relative"}}>
                {bottomPorts.map((port, i) =>
                    <Port port={port} type="input" length={bottomPorts.length} i={i} />
                )}
            </div>
            

            

        </div>
    );
}