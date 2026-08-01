import { type Edge } from "@xyflow/react";

export interface WirePoint {
    x: number;
    y: number;
}

export interface WireData extends Record<string, unknown> {
    vertices: WirePoint[];

    color?: string;
    width?: number;

    selectedVertex?: number;
}