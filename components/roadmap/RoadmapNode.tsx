'use client';

import { Handle, Position, type NodeProps } from 'reactflow';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { NodeVariant } from '@/lib/roadmap-layout';
import type { StepRole } from '@/data/services';

const hiddenHandle = { opacity: 0 };

// Matches the color-coding used in payment-roadmap's real Checkout diagram
// (src/data/roadmaps/checkout/checkout.json, renderer: balsamiq).
const ROLE_STYLES: Record<StepRole, { bg: string; text: string }> = {
  customer: { bg: '#FFEB00', text: '#111111' },
  external: { bg: '#FF9900', text: '#111111' },
  cellulant: { bg: '#228B22', text: '#FFFFFF' },
  success: { bg: '#0A9A00', text: '#FFFFFF' },
  failure: { bg: '#CC3333', text: '#FFFFFF' },
};

interface RoadmapNodeVisualData {
  label: string;
  variant: NodeVariant;
  role?: StepRole;
  isReviewed?: boolean;
}

export function RoadmapNode({ data }: NodeProps<RoadmapNodeVisualData>) {
  const isTrunk = data.variant === 'trunk';
  const roleStyle = data.role ? ROLE_STYLES[data.role] : null;

  return (
    <div
      className={cn(
        'relative flex items-center justify-center rounded-md border-2 border-black px-4 py-2.5 text-center text-sm font-semibold shadow-sm',
        isTrunk ? 'min-w-[200px]' : 'min-w-[220px] border-dashed bg-white text-[13px] font-medium text-slate-500',
      )}
      style={isTrunk && roleStyle ? { backgroundColor: roleStyle.bg, color: roleStyle.text } : undefined}
    >
      {isTrunk && (
        <>
          <Handle type="target" position={Position.Top} id="top" style={hiddenHandle} />
          <Handle type="source" position={Position.Bottom} id="bottom" style={hiddenHandle} />
          <Handle type="source" position={Position.Right} id="right" style={hiddenHandle} />
        </>
      )}
      {!isTrunk && <Handle type="target" position={Position.Left} id="left" style={hiddenHandle} />}

      {data.isReviewed && (
        <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white shadow">
          <Check className="h-3 w-3" />
        </span>
      )}

      {data.label}
    </div>
  );
}
