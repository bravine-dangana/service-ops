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
  calloutButtonText?: string;
}

export function RoadmapNode({ data }: NodeProps<RoadmapNodeVisualData>) {
  if (data.variant === 'label') {
    return (
      <div className="relative px-2 text-lg font-bold text-slate-800">
        <Handle type="source" position={Position.Bottom} id="bottom" style={hiddenHandle} />
        {data.label}
      </div>
    );
  }

  if (data.variant === 'callout') {
    return (
      <div className="w-64 rounded-lg border border-slate-200 bg-white p-4 text-sm leading-relaxed text-slate-600 shadow-sm">
        <p>{data.label}</p>
        {data.calloutButtonText && (
          <span className="mt-3 block rounded-md bg-slate-100 px-3 py-2 text-center text-sm font-medium text-slate-500">
            {data.calloutButtonText}
          </span>
        )}
      </div>
    );
  }

  const isTrunk = data.variant === 'trunk';
  const roleStyle = data.role ? ROLE_STYLES[data.role] : null;

  return (
    <div
      className={cn(
        'relative flex items-center justify-center whitespace-normal break-words rounded-md border-2 border-black px-3 py-2 text-center text-[13px] font-semibold leading-snug shadow-sm',
        isTrunk ? 'w-[210px]' : 'w-[190px] border-dashed bg-white text-[12px] font-medium text-slate-500',
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
