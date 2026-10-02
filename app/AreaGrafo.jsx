// AreaGrafo.jsx
import { Background, ReactFlow } from '@xyflow/react';

export default function AreaGrafo({
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onNodeClick,
    onEdgeClick,
    onPaneClick
}) {
    return (
        // AreaGrafo.jsx (Modifica solo lo stile del div principale)
        <div className="area-grafo" style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'transparent', // Modificato da '#f5f7fa' a 'transparent' per lasciar vedere lo sfondo
            zIndex: 1
        }}>

            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onNodeClick={onNodeClick}
                onEdgeClick={onEdgeClick}
                onPaneClick={onPaneClick}
                // Mantiene la centratura con un singolo livello di zoom-out all avvio
                fitView
                fitViewOptions={{ padding: 0.45, includeHiddenNodes: false }}
                minZoom={0.2}
                maxZoom={1.5}
            >
                {/* I controlli di zoom manuali e la minimappa sono stati rimossi da qui */}
                <Background variant="dots" gap={16} size={1} />
            </ReactFlow>
        </div>
    );
}
