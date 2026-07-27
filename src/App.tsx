
import { useCallback, useRef, useState } from 'react';
import { ReactFlow, addEdge, type Connection, useNodesState, useEdgesState, Controls, Background } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import genericNode, { type GenericNode } from './nodes/GenericNode';
import NodeEditor from './NodeEditor';

import { v4 as uuidv4 } from "uuid";


import "./App.css";
import { downloadProject, loadProject, saveProject } from './Project';


const NodeTypes = {
  "genericNode": genericNode
};


const initialNodes:GenericNode[] = [
  { 
    id: uuidv4(), 
    position: { x: 50, y: 300 }, 
    data: { 
      name: "Voltage Regulator", 
      ports: [ 
        { 
          id: "Feedback", 
          name: "Feedback",
          side: "left",
          type: "number",
		  direction: "in"
        }, 
        { 
          id: "Vset", 
          name: "Vset",
          side: "left",
          type: "number",
		  direction: "in"
        },
        {
          id: "Vout", 
          name: "Vout",
          side: "left",
          type: "number",
		  direction: "out"
        }
      ] 
    }, 
    type: "genericNode" 
  },

  { 
    id: uuidv4(), 
    position: { x: 0, y: 0 }, 
    data: { 
      name: "Power Transistors", 
      ports: [ 
        { 
          id: "Collector", 
          name: "Collector",
          side: "right",
          type: "number",
		  direction: "in"
        }, 
        { 
          id: "Base", 
          name: "Base",
          side: "left",
          type: "number",
		  direction: "in"
        },
        {
          id: "Emitter", 
          name: "Emitter",
          side: "left",
          type: "number",
		  direction: "out"
        }
      ] 
    }, 
    type: "genericNode" 
  },

];
const initialEdges = [
  { id: 'n1-n2', source: 'n1', target: 'n2' },
];



function App() {
  	const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  	const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);


	const fileInputRef = useRef<HTMLInputElement>(null);

  	const [editedNode, setEditedNode] = useState<GenericNode | null>(null);

  	const onNodeDoubleClick = useCallback((event, node:GenericNode) => {
  	  	setEditedNode(node);
  	  	console.log("Double clicked node:", node);
  	}, []);

	const [projectName, setProjectName] = useState("Project");
  
 
  	const onConnect = useCallback((params:Connection) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)), []);


	const handleLoadProject = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
	
		const file = event.target.files?.[0];
	
		if (!file)
			return;
	
		const reader = new FileReader();
	
		reader.onload = () => {
	
			try {

				const project = loadProject(reader.result as string);

				setProjectName(project.name);
		
				setNodes(project.nodes);
				setEdges(project.edges);
		
			} catch {
		
				alert("Invalid project file.");
		
			}
			event.target.value = "";

		};
	
		reader.readAsText(file);
	};
 
  return (
    <>
		<header className='project-menu'>
			<div className="logo">
                <img src="/VertexLogo.png" alt="Logo" />
            </div>
			<div className='project-menu-inner'>
				<input type="text" value={projectName} onChange={(e) => setProjectName((e.target as HTMLInputElement).value)} />
				<br />
				<div className="project-menu-button-div">
					<button className="project-menu-button" onClick={() => {
						const json = saveProject({ name: projectName, nodes: nodes, edges: edges });
						downloadProject(json, projectName);
          			}}>
						Save
					</button>
					<input className='project-menu-button'
					    ref={fileInputRef}
					    type="file"
					    accept=".esketch,.json"
					    style={{ display: "none" }}
					    onChange={handleLoadProject}
					/>
					<button className="project-menu-button" onClick={() => fileInputRef.current?.click()}>
						Load
					</button>
					
				</div>
			</div>

		</header>
        <main>
      	    <div className='canvas' >
                    
      	      <ReactFlow
      	        nodes={nodes}
      	        edges={edges}
      	        onNodesChange={onNodesChange}
      	        onEdgesChange={onEdgesChange}
      	        onConnect={onConnect}
      	        nodeTypes={NodeTypes}
      	        fitView
                    
      	        onNodeDoubleClick={onNodeDoubleClick}
                    
      	        colorMode='dark'
                    
                  snapGrid={[10, 10]}
                  snapToGrid={true}
                  >
      	        <Controls></Controls>
		    	<Background></Background>
      	      </ReactFlow>
                    
      	      <NodeEditor
      	        node={editedNode}
      	        onClose={() => setEditedNode(null)}
      	        onSave={(node) => {
                      setNodes(nodes =>
                        nodes.map(n =>
                            n.id === node.id
                            ? node
                            : n
                        )
                    );

                    setEditedNode(null);
                }}
      	      />
      	    </div>
		    <section className='menu-section'>

		    </section>
        </main>
    </>

  )
}

export default App
