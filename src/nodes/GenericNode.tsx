import { type NodeProps, type Node } from "@xyflow/react";
import type { PortInterface } from "./Port";
import Port from "./Port";

import "./GenericNode.css";



export interface GenericNodeData {
    [key: string]: unknown;
    name: string;
    inputs: PortInterface[];
    outputs: PortInterface[];
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

    const topPorts = data.inputs.filter(p => p.side === "top").concat(data.outputs.filter(p => p.side === "top"));
    const bottomPorts = data.inputs.filter(p => p.side === "bottom").concat(data.outputs.filter(p => p.side === "bottom"));
    const leftPorts = data.inputs.filter(p => p.side === "left").concat(data.outputs.filter(p => p.side === "left"));
    const rightPorts = data.inputs.filter(p => p.side === "right").concat(data.outputs.filter(p => p.side === "right"));

    return (
        <div className="generic-node" style={{ padding: "10px", height: 40 +  data.inputs.length * 20 + "px", width: "150px", position: "relative" }}>
            
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