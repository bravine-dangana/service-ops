import type { FlowStep, StepRole, StepStatus } from '@/data/services';

export type NodeVariant = 'trunk' | 'branch' | 'label' | 'callout';

export interface RoadmapNodeContent {
  id: string;
  label: string;
  explanation: string;
  contentStatus: StepStatus;
  variant: NodeVariant;
  role?: StepRole;
  calloutButtonText?: string;
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

const ROW_HEIGHT = 90;
const TRUNK_X = 300;
const BRANCH_X = 560;
const CALLOUT_X = 10;
const TOP_PADDING = 40;
const BOTTOM_PADDING = 40;
const BRANCH_ROW_GAP = 34;
const BRANCHES_PER_STEP = 2;

export function buildRoadmapGraph(serviceName: string, steps: FlowStep[]) {
  const nodes: RoadmapNodePosition[] = [];
  const edges: RoadmapEdgeDef[] = [];

  // Top section label — mirrors roadmap.sh's plain-text heading (e.g. "Front-end")
  // sitting above the trunk with a dotted line down into the first step.
  const labelId = '__label';
  nodes.push({
    id: labelId,
    position: { x: TRUNK_X + 40, y: 0 },
    type: 'roadmap',
    data: {
      id: labelId,
      label: serviceName,
      explanation: '',
      contentStatus: 'reviewed',
      variant: 'label',
    },
  });

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

    if (index === 0) {
      edges.push({
        id: `${labelId}-${step.id}`,
        source: labelId,
        sourceHandle: 'bottom',
        target: step.id,
        targetHandle: 'top',
        variant: 'dotted',
      });
    }

    for (let branchIndex = 0; branchIndex < BRANCHES_PER_STEP; branchIndex += 1) {
      const branchId = `${step.id}__placeholder-${branchIndex}`;
      nodes.push({
        id: branchId,
        position: { x: BRANCH_X, y: y + branchIndex * BRANCH_ROW_GAP - (BRANCH_ROW_GAP / 2) },
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
        id: `${step.id}-branch-${branchIndex}`,
        source: step.id,
        sourceHandle: 'right',
        target: branchId,
        targetHandle: 'left',
        variant: 'dotted',
      });
    }

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

  // One example info callout, floated to the left of the trunk partway down —
  // mirrors roadmap.sh's "HTML, CSS and JavaScript are the backbone..." style asides.
  // Not connected by an edge — purely informational, like the reference.
  if (steps.length > 0) {
    const midIndex = Math.floor(steps.length / 2);
    nodes.push({
      id: '__callout',
      position: { x: CALLOUT_X, y: TOP_PADDING + midIndex * ROW_HEIGHT - 30 },
      type: 'roadmap',
      data: {
        id: '__callout',
        label:
          'Add short, plain-language context for this part of the flow here — placeholder text, edit from the admin page.',
        explanation: '',
        contentStatus: 'draft',
        variant: 'callout',
        calloutButtonText: 'Learn more',
      },
    });
  }

  const branchSpread = (BRANCHES_PER_STEP - 1) * BRANCH_ROW_GAP;
  const height = TOP_PADDING + steps.length * ROW_HEIGHT + branchSpread + BOTTOM_PADDING;
  const width = BRANCH_X + 190 + 60;

  return { nodes, edges, height, width };
}
