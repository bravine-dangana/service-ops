'use client';

import { useState } from 'react';
import { ChevronDown, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export function InfoAccordion({ name, description }: { name: string; description: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-8 rounded-xl border border-slate-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-medium text-slate-700"
      >
        <span className="flex items-center gap-2">
          <Info className="h-4 w-4 text-slate-400" />
          What is {name}?
        </span>
        <ChevronDown className={cn('h-4 w-4 text-slate-400 transition-transform', open && 'rotate-180')} />
      </button>
      {open && <p className="border-t border-slate-100 px-4 py-3 text-sm text-slate-600">{description}</p>}
    </div>
  );
}
