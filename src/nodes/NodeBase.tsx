import Port, { PortContainer, type PortInterface } from "./Port";

import "./NodeBase.css"

interface NodeBaseProps {
    ports: PortInterface[];
    children: React.ReactNode;
}

export default function NodeBase({
    ports,
    children,
}: NodeBaseProps) {

    const topPorts = ports.filter(p => p.side === "top");
    const bottomPorts = ports.filter(p => p.side === "bottom");
    const leftPorts = ports.filter(p => p.side === "left");
    const rightPorts = ports.filter(p => p.side === "right");

    return (
        <div className="node-base">

            <div className="port-row top">
                {topPorts.map((port, i) => (
                    <Port
                        key={port.id}
                        port={port}
                    />
                ))}
            </div>

            <div className="node-header">
            </div>

            <div className="node-body">

                <div className="port-column">
                    {leftPorts.map((port, i) => (
                    <Port
                        key={port.id}
                        port={port}
                    />
                ))}
                </div>

                <div className="node-content">
                    {children}
                </div>

                <div className="port-column">
                    {rightPorts.map((port, i) => (
                    <Port
                        key={port.id}
                        port={port}
                    />
                ))}
                </div>

            </div>

            <div className="port-row bottom">
                {bottomPorts.map((port, i) => (
                    <Port
                        key={port.id}
                        port={port}
                    />
                ))}
            </div>

        </div>
    );
}