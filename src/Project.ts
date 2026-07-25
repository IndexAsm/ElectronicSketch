import type { Edge } from "@xyflow/react";
import type { GenericNode } from "./nodes/GenericNode";

export interface Project {
    name: string;

    nodes: GenericNode[];

    edges: Edge[];
}


export function saveProject( {name, nodes, edges}: Project): string {

    const project: Project = {
        name,
        nodes,
        edges
    };

    return JSON.stringify(project, null, 4);
}

export function downloadProject(json: string, name: string) {

    const blob = new Blob(
        [json],
        {
            type: "application/json"
        }
    );

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = name + ".esketch";

    a.click();

    URL.revokeObjectURL(url);
}

export function loadProject(
    json: string
): Project {

    return JSON.parse(json);
}