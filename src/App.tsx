
import { useCallback, useState } from 'react';
import { ReactFlow, addEdge, type Connection, type Node, useNodesState, useEdgesState, Controls } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import genericNode, { type GenericNode, type GenericNodeData } from './nodes/GenericNode';
import NodeEditor from './NodeEditor';

import "./App.css";


const NodeTypes = {
  "genericNode": genericNode
};


const initialNodes:GenericNode[] = [
  { 
    id: 'n3', 
    position: { x: 50, y: 300 }, 
    data: { 
      name: "Voltage Regulator", 
      inputs: [ 
        { 
          id: "Feedback", 
          name: "Feedback",
          side: "left",
          type: "number"
        }, 
        { 
          id: "Vset", 
          name: "Vset",
          side: "left",
          type: "number"
        }
      ], 
      outputs: [ 
        {
          id: "Vout", 
          name: "Vout",
          side: "left",
          type: "number"
        }
      ] 
    }, 
    type: "genericNode" 
  },

  { 
    id: 'n1', 
    position: { x: 0, y: 0 }, 
    data: { 
      name: "Power Transistors", 
      inputs: [ 
        { 
          id: "Collector", 
          name: "Collector",
          side: "right",
          type: "number"
        }, 
        { 
          id: "Base", 
          name: "Base",
          side: "left",
          type: "number"
        }
      ], 
      outputs: [ 
        {
          id: "Emitter", 
          name: "Emitter",
          side: "left",
          type: "number"
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

  const [editedNode, setEditedNode] = useState<GenericNode | null>(null);

  const onNodeDoubleClick = useCallback((event, node) => {
    setEditedNode(node);
    console.log("Double clicked node:", node);
  }, []);

  
 
  //const onNodesChange = useCallback((changes) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)), []);
  //const onEdgesChange = useCallback((changes) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)), []);
  const onConnect = useCallback((params:Connection) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)), []);
 
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
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
      >
        <Controls></Controls>
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
  )
}

export default App
