import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import type { PortInterface } from "./nodes/Port";
import "./PortEditor.css"
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";
import { useEffect, useState } from "react";

interface PortEditorProps {
    ports: PortInterface[];
    onClose: () => void;
    onSave: (newPorts: PortInterface[]) => void;
    editPorts: boolean;
}



interface PortRowProps {
    port:PortInterface;
};

function PortRow({port}: PortRowProps) {

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition
    } = useSortable({
        id: port.id
    });

    const style = {

        transform: CSS.Transform.toString(transform),
    
        transition,
    };


    return (
        <div
            ref={setNodeRef}

            style={style}

            {...attributes}

            {...listeners}
            className="draggable-port"
        >
            {port.name}
            <select>
                <option selected>
                    Input
                </option>
                <option>
                    Output
                </option>
            </select>

        </div>
    );
}

export default function PortEditor({ ports, onClose, onSave, editPorts }: PortEditorProps) {
    if (!editPorts)
        return null;

    const [activePorts, setActivePorts] = useState(() => structuredClone(ports));

    useEffect(() => {
        setActivePorts(() => structuredClone(ports));
    }, [ports]);

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
    
        if (!over)
            return;
    
        console.log(active.id);
        console.log(over.id);
    
        setActivePorts(ports_ => {
    
            const oldIndex =
                ports_.findIndex(
                    p => p.id === active.id
                );
        
            const newIndex =
                ports_.findIndex(
                    p => p.id === over.id
                );
        
            return arrayMove(
                ports_,
                oldIndex,
                newIndex
            );
        });
    }


    const groupedPorts = {
        left: activePorts.filter(p => p.side === "left"),
        right: activePorts.filter(p => p.side === "right"),
        top: activePorts.filter(p => p.side === "top"),
        bottom: activePorts.filter(p => p.side === "bottom"),
    };

    return (
        <div className="port-editor">
            <DndContext onDragEnd={handleDragEnd}>
            <SortableContext
                items={groupedPorts.left.map(p => p.id)}
                strategy={verticalListSortingStrategy}
            >
                
                {groupedPorts.left.map(port => (
                    <PortRow
                        key={port.id}
                        port={port}
                    />
                ))}
            
            </SortableContext>
            </DndContext>

            <div className="button-div">
                    <button className="button-cancel" onClick={onClose}>
                        Cancel
                    </button>

                    <button className="button-save" onClick={() => onSave(activePorts)}>
                        Save
                    </button>
                </div>
        </div>  
    );
}