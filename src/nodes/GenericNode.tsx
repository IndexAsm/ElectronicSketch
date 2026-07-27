import { type NodeProps, type Node } from "@xyflow/react";
import type { PortInterface } from "./Port";
import { PortContainer } from "./Port";

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


export default function GenericNode({ data }: NodeProps<GenericNode>) {

    const topPorts = data.ports.filter(p => p.side === "top");
    const bottomPorts = data.ports.filter(p => p.side === "bottom");
    const leftPorts = data.ports.filter(p => p.side === "left");
    const rightPorts = data.ports.filter(p => p.side === "right");

    return (
        <div className="generic-node">

            <div className="node-body">

                <PortContainer side="top" ports={topPorts}/>

                <PortContainer side="bottom" ports={bottomPorts}/>

                <PortContainer side="left" ports={leftPorts}/>

                <PortContainer side="right" ports={rightPorts}/>


                <div className="node-title">
                    {data.name}
                </div>

                <div className="node-content">
                    {/* custom node graphics here */}
                </div>

            </div>

        </div>
    );
}