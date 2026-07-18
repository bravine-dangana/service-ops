import type { FlowStep, StepRole, StepStatus } from '@/data/services';

export type NodeVariant = 'trunk' | 'branch';

export interface RoadmapNodeContent {
  id: string;
  label: string;
  explanation: string;
  contentStatus: StepStatus;
  variant: NodeVariant;
  role?: StepRole;
}

export interface RoadmapNodePosition {
  id: string;
  position: { x: number; y: number };
  data: RoadmapNodeContent;
  type: 'roadmap';
}

export interface RoadmapEdgeDef {
  id: string;
  source: string;
  sourceHandle: string;
  target: string;
  targetHandle: string;
  variant: 'solid' | 'dotted';
}

const ROW_HEIGHT = 110;
const TRUNK_X = 260;
const BRANCH_X = 580;
const TOP_PADDING = 40;
const BOTTOM_PADDING = 40;

export function buildRoadmapGraph(steps: FlowStep[]) {
  const nodes: RoadmapNodePosition[] = [];
  const edges: RoadmapEdgeDef[] = [];

  steps.forEach((step, index) => {
    const y = TOP_PADDING + index * ROW_HEIGHT;

    nodes.push({
      id: step.id,
      position: { x: TRUNK_X, y },
      type: 'roadmap',
      data: {
        id: step.id,
        label: step.title,
        explanation: step.explanation,
        contentStatus: step.status,
        variant: 'trunk',
        role: step.role,
      },
    });

    const branchId = `${step.id}__placeholder`;
    nodes.push({
      id: branchId,
      position: { x: BRANCH_X, y: y + 8 },
      type: 'roadmap',
      data: {
        id: branchId,
        label: 'Related detail (placeholder)',
        explanation:
          'This is a placeholder branch node. Related sub-topics for this step will be added and rearranged from the admin page.',
        contentStatus: 'draft',
        variant: 'branch',
      },
    });

    edges.push({
      id: `${step.id}-branch`,
      source: step.id,
      sourceHandle: 'right',
      target: branchId,
      targetHandle: 'left',
      variant: 'dotted',
    });

    if (index > 0) {
      const prev = steps[index - 1];
      edges.push({
        id: `${prev.id}-${step.id}`,
        source: prev.id,
        sourceHandle: 'bottom',
        target: step.id,
        targetHandle: 'top',
        variant: 'solid',
      });
    }
  });

  const height = TOP_PADDING + steps.length * ROW_HEIGHT + BOTTOM_PADDING;

  return { nodes, edges, height };
}
