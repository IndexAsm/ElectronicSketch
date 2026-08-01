import {
    BaseEdge,
    EdgeLabelRenderer,
    getStraightPath,
    type EdgeProps,
} from "@xyflow/react";

import type { WireData } from "./Wire";

export default function WireEdge({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    data,
}: EdgeProps) {

    const vertices = (data as WireData | undefined)?.vertices ?? [];

    const points = [
        { x: sourceX, y: sourceY },
        ...vertices,
        { x: targetX, y: targetY },
    ];

    let path = `M ${points[0].x} ${points[0].y}`;

    for (let i = 1; i < points.length; i++) {
        path += ` L ${points[i].x} ${points[i].y}`;
    }

    

    return (
        <>
            {vertices.map((v, i) => (
                
                <circle
                    key={i}
                    cx={v.x}
                    cy={v.y}
                    r={5}
                    fill="white"
                />
                
            ))}
            <BaseEdge id={id} path={path} />

            
        </>
    );
}