export function ProgressBar({
  reviewedCount,
  total,
  accent,
}: {
  reviewedCount: number;
  total: number;
  accent: string;
}) {
  const pct = total === 0 ? 0 : Math.round((reviewedCount / total) * 100);

  return (
    <div className="flex items-center gap-3">
      <div className="h-1.5 w-40 overflow-hidden rounded-full bg-slate-200 sm:w-56">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, backgroundColor: accent }}
        />
      </div>
      <span className="text-xs font-medium text-slate-500">
        {reviewedCount}/{total} reviewed
      </span>
    </div>
  );
}
