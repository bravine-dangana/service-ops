'use client';

import { Check, X } from 'lucide-react';
import type { FlowStep } from '@/data/services';
import { cn } from '@/lib/utils';

export function SidePanel({
  step,
  index,
  total,
  accent,
  isReviewed,
  showReviewToggle = true,
  onToggleReviewed,
  onClose,
}: {
  step: FlowStep;
  index: number;
  total: number;
  accent: string;
  isReviewed: boolean;
  showReviewToggle?: boolean;
  onToggleReviewed: () => void;
  onClose: () => void;
}) {
  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-slate-900/40 animate-fade-in"
        onClick={onClose}
        aria-hidden
      />
      <aside
        className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-slate-200 bg-white p-6 shadow-2xl animate-slide-in"
        role="dialog"
        aria-label={step.title}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: accent }}>
              Step {index + 1} of {total}
            </p>
            <h2 className="mt-1.5 text-xl font-semibold text-slate-900">{step.title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 p-1.5 text-slate-500 transition hover:border-slate-300 hover:text-slate-900"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {step.status === 'draft' && (
          <span className="mt-4 inline-flex w-fit items-center rounded-full border border-amber-300 bg-amber-50 px-2.5 py-0.5 text-[11px] font-medium text-amber-700">
            Draft — pending SME review
          </span>
        )}

        <p className="mt-4 flex-1 text-sm leading-relaxed text-slate-600">{step.explanation}</p>

        {showReviewToggle && (
          <button
            type="button"
            onClick={onToggleReviewed}
            className={cn(
              'mt-6 flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition',
              isReviewed
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:text-slate-900',
            )}
          >
            <Check className="h-4 w-4" />
            {isReviewed ? 'Marked as reviewed' : 'Mark as reviewed'}
          </button>
        )}
      </aside>
    </>
  );
}
