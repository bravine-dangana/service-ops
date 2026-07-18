import Link from 'next/link';
import { Check, ArrowUpRight } from 'lucide-react';
import { services, type ServiceDefinition } from '@/data/services';
import { customerImplementationsByServiceSlug } from '@/lib/sequence-diagram';

const LEGEND: Array<{ color: string; label: string }> = [
  { color: '#FFEB00', label: 'Customer / merchant-facing step' },
  { color: '#FF9900', label: 'MNO / external network step' },
  { color: '#228B22', label: "Cellulant's own platform step" },
  { color: '#0A9A00', label: 'Successful outcome' },
  { color: '#CC3333', label: 'Failure / retry outcome' },
];

export function RoadmapSidebar({ service }: { service: ServiceDefinition }) {
  const related = services.filter((s) => s.slug !== service.slug);
  const customerImplementations = customerImplementationsByServiceSlug[service.slug] ?? [];

  return (
    <div className="flex flex-col gap-5">
      {customerImplementations.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Customer implementations
          </p>
          <ul className="space-y-2">
            {customerImplementations.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-cellulant-blue"
                >
                  <ArrowUpRight className="h-3.5 w-3.5 text-slate-300" />
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
          What the colors mean
        </p>
        <ul className="space-y-2.5">
          {LEGEND.map((item) => (
            <li key={item.label} className="flex items-center gap-2.5 text-sm text-slate-700">
              <span
                className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-black/20"
                style={{ backgroundColor: item.color }}
              />
              {item.label}
            </li>
          ))}
          <li className="flex items-center gap-2.5 text-sm text-slate-700">
            <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
              <Check className="h-2.5 w-2.5" />
            </span>
            You've marked this step reviewed
          </li>
        </ul>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Related services
        </p>
        <ul className="space-y-2">
          {related.map((s) => (
            <li key={s.slug}>
              <Link
                href={`/${s.slug}`}
                className="flex items-center gap-2 text-sm text-slate-600 hover:text-cellulant-blue"
              >
                <Check className="h-3.5 w-3.5 text-slate-300" />
                {s.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
