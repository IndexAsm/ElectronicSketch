import {
    DndContext,
    pointerWithin,
    useDroppable,
    type DragEndEvent,
    type DragMoveEvent,
    type DragStartEvent,
} from "@dnd-kit/core";
import type { PortInterface, PortType } from "./nodes/Port";
import "./PortEditor.css"
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";

interface PortEditorProps {
    ports: PortInterface[];
    onClose: () => void;
    onSave: (newPorts: PortInterface[]) => void;
    editPorts: boolean;
}


interface PortRowProps {
    port: PortInterface;
    onChange: (port: PortInterface) => void;
    onDelete: (portId: string) => void;
};


// Renders the visual content of a port row. Used both for the real,
// sortable row and for the floating drag ghost (with `style` overridden
// to pin it under the cursor and `interactive={false}` to disable inputs).
function PortRowContent({
    port,
    interactive,
    style,
}: {
    port: PortInterface;
    interactive: boolean;
    style?: CSSProperties;
}) {
    return (
        <div className={"draggable-port" + (interactive ? "" : " drag-overlay")} style={style}>
            <span
                className="drag-handle"
                style={{ padding: "0 8px", userSelect: "none" }}
            >
                ☰
            </span>

            <input value={port.name} readOnly={!interactive} />

            <select disabled={!interactive} value={port.direction}>
                <option value="in">Input</option>
                <option value="out">Output</option>
            </select>

            <select disabled={!interactive} value={port.type}>
                <option value="number">Number</option>
                <option value="string">String</option>
                <option value="boolean">Boolean</option>
            </select>

            <button disabled={!interactive} className="delete-port-button">
                <img
                    src="/icons/delete-left-solid-full.svg"
                    className="delete-icon"
                    alt=""
                />
            </button>
        </div>
    );
}


function PortRow({ port, onChange, onDelete }: PortRowProps) {

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({
        id: port.id
    });

    return (
        <div
            ref={setNodeRef}
            style={{
                transform: isDragging ? undefined : CSS.Transform.toString(transform),
                transition,
                opacity: isDragging ? 0 : 1,
            }}
            className="draggable-port"
        >
            <span
                {...attributes}
                {...listeners}
                className="drag-handle"
                style={{ padding: "0 8px", userSelect: "none" }}
            >
                ☰
            </span>

            <input
                type="text"
                value={port.name}
                onChange={(e) => {
                    onChange({
                        ...port,
                        name: e.target.value
                    });
                }}
            />
            <select
                value={port.direction}
                onChange={(e) =>
                    onChange({
                        ...port,
                        direction: e.target.value as "in" | "out",
                    })
                }
            >
                <option value="in">Input</option>
                <option value="out">Output</option>
            </select>
            <select
                value={port.type}
                onChange={(e) =>
                    onChange({
                        ...port,
                        type: e.target.value as PortType,
                    })
                }
            >
                <option value="number">Number</option>
                <option value="string">String</option>
                <option value="boolean">Boolean</option>
            </select>

            <button onClick={() => onDelete(port.id)} className="delete-port-button">
                <img src="/icons/delete-left-solid-full.svg" className="delete-icon" alt="" />
            </button>

        </div>
    );
}

interface PortListProps {
    title: string;
    ports: PortInterface[];
    setPorts: React.Dispatch<React.SetStateAction<PortInterface[]>>;
    overContainer?: string | null;
}

function PortList({ title, ports, setPorts, overContainer }: PortListProps) {

    const { setNodeRef } = useDroppable({
        id: title.toLowerCase(),
        data: {
            type: "container",
            side: title.toLowerCase()
        }
    });


    return (
        <div
            ref={setNodeRef}
            className={
                "port-list " +
                (overContainer === title.toLowerCase()
                    ? "port-list-active"
                    : "")
            }>
            <h3>{title}</h3>
            <hr />
            <SortableContext
                items={ports.map(p => p.id)}
                strategy={verticalListSortingStrategy}
            >

                {ports.map(port => (
                    <PortRow
                        key={port.id}
                        port={port}
                        onChange={(newPort) => {
                            setPorts(ports_ => {
                                const index = ports_.findIndex(p => p.id === newPort.id);
                                if (index !== -1) {
                                    const updatedPorts = [...ports_];
                                    updatedPorts[index] = newPort;
                                    return updatedPorts;
                                }
                                return ports_;
                            });
                        }}
                        onDelete={(portId: string) => {
                            setPorts(ports_ => ports_.filter(p => p.id !== portId));
                        }}
                    />
                ))}

            </SortableContext>
        </div>

    );
}


type PortListState = [
    PortInterface[],
    React.Dispatch<React.SetStateAction<PortInterface[]>>
];

type Point = { x: number; y: number };

// Pulls real viewport client coordinates out of whatever native event
// triggered the drag (mouse, pointer, or touch).
function getClientPoint(event: Event): Point {
    if (event instanceof PointerEvent || event instanceof MouseEvent) {
        return { x: event.clientX, y: event.clientY };
    }
    if (typeof TouchEvent !== "undefined" && event instanceof TouchEvent && event.touches.length > 0) {
        return { x: event.touches[0].clientX, y: event.touches[0].clientY };
    }
    return { x: 0, y: 0 };
}


export default function PortEditor({ ports, onClose, onSave, editPorts }: PortEditorProps) {

    const [leftPorts, setLeftPorts] = useState<PortInterface[]>([]);
    const [rightPorts, setRightPorts] = useState<PortInterface[]>([]);
    const [topPorts, setTopPorts] = useState<PortInterface[]>([]);
    const [bottomPorts, setBottomPorts] = useState<PortInterface[]>([]);

    const [draggedPort, setDraggedPort] = useState<PortInterface | null>(null);
    const [overContainer, setOverContainer] = useState<string | null>(null);

    // Ghost position, tracked in real viewport (client) coordinates rather
    // than anything CSS-transform-derived. This is what makes the ghost
    // immune to any pan/zoom/transform applied by an ancestor canvas.
    const [ghostPosition, setGhostPosition] = useState<Point | null>(null);
    const dragStartClientRef = useRef<Point>({ x: 0, y: 0 });
    const grabOffsetRef = useRef<Point>({ x: 0, y: 0 });

    useEffect(() => {
        if (!editPorts)
            return;

        setLeftPorts(ports.filter(p => p.side === "left"));
        setRightPorts(ports.filter(p => p.side === "right"));
        setTopPorts(ports.filter(p => p.side === "top"));
        setBottomPorts(ports.filter(p => p.side === "bottom"));

    }, [ports, editPorts]);


    function handleDragEnd(event: DragEndEvent) {

        const { active, over } = event;

        if (!over)
            return;


        const portId = active.id.toString();
        const overId = over.id.toString();


        let source: PortListState | null = null;
        let destination: PortListState | null = null;


        const lists: Record<string, PortListState> = {
            left: [leftPorts, setLeftPorts],
            right: [rightPorts, setRightPorts],
            top: [topPorts, setTopPorts],
            bottom: [bottomPorts, setBottomPorts],
        };


        // Find source list
        for (const list of Object.values(lists)) {
            if (list[0].some(p => p.id === portId)) {
                source = list;
                break;
            }
        }

        if (!source)
            return;


        // Dropped on another list
        if (lists[overId as keyof typeof lists]) {
            destination = lists[overId as keyof typeof lists];
        } else {
            // Dropped on another item
            for (const list of Object.values(lists)) {
                if (list[0].some(p => p.id === overId)) {
                    destination = list;
                    break;
                }
            }
        }

        if (!destination)
            return;


        // Same list -> reorder
        if (source[1] === destination[1]) {

            const items = source[0];
            const oldIndex = items.findIndex(p => p.id === portId);
            const newIndex = items.findIndex(p => p.id === overId);

            if (oldIndex !== -1 && newIndex !== -1) {
                source[1](arrayMove(items, oldIndex, newIndex));
            }

            return;
        }


        // Different list -> move item
        const movedPort = source[0].find(p => p.id === portId);

        if (!movedPort)
            return;

        source[1](source[0].filter(p => p.id !== portId));

        const newPort = {
            ...movedPort,
            side: overId as PortInterface["side"]
        };

        const overIndex = destination[0].findIndex(p => p.id === overId);

        if (overIndex === -1) {
            destination[1]([...destination[0], newPort]);
        } else {
            const copy = [...destination[0]];
            copy.splice(overIndex, 0, newPort);
            destination[1](copy);
        }
    }

    function addPort() {
        setLeftPorts(ports => [
            ...ports,
            {
                id: crypto.randomUUID(),
                name: "New Port",
                direction: "in",
                side: "left",
                type: "number",
            },
        ]);
    }

    function withSide(
        ports: PortInterface[],
        side: PortInterface["side"]
    ): PortInterface[] {
        return ports.map(p => ({ ...p, side }));
    }

    function handleDragStart(event: DragStartEvent) {
        const id = event.active.id;

        const port =
            [...leftPorts, ...rightPorts, ...topPorts, ...bottomPorts]
                .find(p => p.id === id);

        const clientPoint = getClientPoint(event.activatorEvent);
        const initialRect = event.active.rect.current.initial;

        grabOffsetRef.current = initialRect
            ? { x: clientPoint.x - initialRect.left, y: clientPoint.y - initialRect.top }
            : { x: 0, y: 0 };

        dragStartClientRef.current = clientPoint;
        setGhostPosition(clientPoint);
        setDraggedPort(port ?? null);
    }

    function handleDragMove(event: DragMoveEvent) {
        setGhostPosition({
            x: dragStartClientRef.current.x + event.delta.x,
            y: dragStartClientRef.current.y + event.delta.y,
        });
    }

    function endDrag() {
        setDraggedPort(null);
        setGhostPosition(null);
        setOverContainer(null);
    }

    if (!editPorts)
        return null;

    return (
        <div className="port-editor">
            <DndContext
                onDragStart={handleDragStart}
                onDragMove={handleDragMove}

                onDragEnd={(event) => {
                    handleDragEnd(event);
                    endDrag();
                }}

                onDragCancel={endDrag}

                onDragOver={(event) => {
                    const { over } = event;

                    if (!over) {
                        setOverContainer(null);
                        return;
                    }

                    if (over.data.current?.type === "container") {
                        setOverContainer(over.data.current.side);
                    }
                }}

                collisionDetection={pointerWithin}
            >
                <PortList
                    title="Left"
                    ports={leftPorts}
                    setPorts={setLeftPorts}
                    overContainer={overContainer}
                />
                <PortList
                    title="Right"
                    ports={rightPorts}
                    setPorts={setRightPorts}
                    overContainer={overContainer}
                />
                <PortList
                    title="Top"
                    ports={topPorts}
                    setPorts={setTopPorts}
                    overContainer={overContainer}
                />
                <PortList
                    title="Bottom"
                    ports={bottomPorts}
                    setPorts={setBottomPorts}
                    overContainer={overContainer}
                />
            </DndContext>

            {draggedPort && ghostPosition && createPortal(
                // Wrapper carries the same "port-editor" class so any CSS
                // rule scoped like ".port-editor .draggable-port {...}"
                // still matches, even though this subtree lives directly
                // under <body> and outside any transformed canvas ancestor.
                <div
                    className="port-editor"
                    style={{
                        position: "fixed",
                        inset: 0,
                        width: 0,
                        height: 0,
                        overflow: "visible",
                        pointerEvents: "none",
                    }}
                >
                    <PortRowContent
                        port={draggedPort}
                        interactive={false}
                        style={{
                            position: "fixed",
                            left: ghostPosition.x - grabOffsetRef.current.x,
                            top: ghostPosition.y - grabOffsetRef.current.y,
                            margin: 0,
                            pointerEvents: "none",
                            zIndex: 9999,
                        }}
                    />
                </div>,
                document.body
            )}

            <button onClick={addPort} className="add-port-button">
                + Add Port
            </button>
            <div className="button-div">
                <button className="button-cancel" onClick={onClose}>
                    Cancel
                </button>

                <button className="button-save" onClick={() => {

                    const newPorts = [
                        ...withSide(leftPorts, "left"),
                        ...withSide(rightPorts, "right"),
                        ...withSide(topPorts, "top"),
                        ...withSide(bottomPorts, "bottom"),
                    ];

                    onSave(newPorts);
                }}>
                    Save
                </button>
            </div>
        </div>
    );
}