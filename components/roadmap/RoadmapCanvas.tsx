'use client';

import 'reactflow/dist/style.css';
import { useCallback, useMemo, useState } from 'react';
import ReactFlow, { type Node, type Edge } from 'reactflow';
import type { ServiceDefinition } from '@/data/services';
import { useProgress } from '@/hooks/useProgress';
import { buildRoadmapGraph, type RoadmapNodePosition } from '@/lib/roadmap-layout';
import { RoadmapNode } from './RoadmapNode';
import { SidePanel } from '../SidePanel';
import { ProgressBar } from '../ProgressBar';

const nodeTypes = { roadmap: RoadmapNode };

export function RoadmapCanvas({ service }: { service: ServiceDefinition }) {
  const { nodes: rawNodes, edges: rawEdges, height, width } = useMemo(
    () => buildRoadmapGraph(service.name, service.steps),
    [service.name, service.steps],
  );

  const stepIds = useMemo(() => service.steps.map((step) => step.id), [service.steps]);
  const { toggleStep, isReviewed, reviewedCount, total } = useProgress(service.slug, stepIds);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);

  const nodes: Node[] = useMemo(
    () =>
      rawNodes.map((node) => ({
        id: node.id,
        position: node.position,
        type: node.type,
        data: {
          ...node.data,
          isReviewed: node.data.variant === 'trunk' && isReviewed(node.id),
        },
      })),
    [rawNodes, isReviewed],
  );

  const edges: Edge[] = useMemo(
    () =>
      rawEdges.map((edge) => ({
        id: edge.id,
        source: edge.source,
        sourceHandle: edge.sourceHandle,
        target: edge.target,
        targetHandle: edge.targetHandle,
        type: edge.variant === 'solid' ? 'straight' : 'default',
        style:
          edge.variant === 'solid'
            ? { stroke: '#4135D6', strokeWidth: 2 }
            : { stroke: '#94a3b8', strokeWidth: 1.5, strokeDasharray: '4 4' },
      })),
    [rawEdges],
  );

  const onNodeClick = useCallback(
    (_event: unknown, node: Node) => {
      const clicked = rawNodes.find((n: RoadmapNodePosition) => n.id === node.id);
      if (clicked && (clicked.data.variant === 'trunk' || clicked.data.variant === 'branch')) {
        setActiveNodeId(node.id);
      }
    },
    [rawNodes],
  );

  const clickableNodes = useMemo(
    () =>
      rawNodes.filter(
        (node: RoadmapNodePosition) => node.data.variant === 'trunk' || node.data.variant === 'branch',
      ),
    [rawNodes],
  );

  const activeContent = rawNodes.find((node: RoadmapNodePosition) => node.id === activeNodeId)?.data ?? null;
  const activeIsTrunk = activeContent?.variant === 'trunk';

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-500">Click any step to read what happens there.</p>
        <ProgressBar reviewedCount={reviewedCount} total={total} accent={service.accent} />
      </div>

      <div className="w-full overflow-x-auto">
        <div style={{ height, width, minWidth: '100%' }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodeClick={onNodeClick}
            nodesDraggable={false}
            nodesConnectable={false}
            elementsSelectable={false}
            panOnDrag={false}
            panOnScroll={false}
            zoomOnScroll={false}
            zoomOnPinch={false}
            zoomOnDoubleClick={false}
            preventScrolling={false}
            proOptions={{ hideAttribution: true }}
            defaultViewport={{ x: 0, y: 0, zoom: 1 }}
            minZoom={1}
            maxZoom={1}
          />
        </div>
      </div>

      {activeContent && (
        <SidePanel
          step={{
            id: activeContent.id,
            title: activeContent.label,
            explanation: activeContent.explanation,
            status: activeContent.contentStatus,
          }}
          index={clickableNodes.findIndex((node: RoadmapNodePosition) => node.id === activeNodeId)}
          total={clickableNodes.length}
          accent={service.accent}
          isReviewed={activeIsTrunk && isReviewed(activeContent.id)}
          showReviewToggle={activeIsTrunk}
          onToggleReviewed={() => toggleStep(activeContent.id)}
          onClose={() => setActiveNodeId(null)}
        />
      )}
    </div>
  );
}
