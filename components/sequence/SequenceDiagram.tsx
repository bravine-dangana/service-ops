'use client';

import { Workflow, Zap, Database } from 'lucide-react';
import { cn } from '@/lib/utils';
import { layoutSequenceDiagram, type SequenceDiagramData, type SystemIcon } from '@/lib/sequence-diagram';
import { ActorHeader } from './ActorHeader';

const ICONS: Record<SystemIcon, typeof Workflow> = {
  queue: Workflow,
  cache: Zap,
  database: Database,
};

export function SequenceDiagram({ data }: { data: SequenceDiagramData }) {
  const { actorX, messageY, annotationY, width, height, headerHeight } = layoutSequenceDiagram(data);

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-slate-200 bg-white p-6">
      <div className="relative" style={{ width, height }}>
        {/* actor headers */}
        {data.actors.map((actor) => (
          <div
            key={actor.id}
            className="absolute top-0 -translate-x-1/2"
            style={{ left: actorX.get(actor.id) }}
          >
            <ActorHeader actor={actor} />
          </div>
        ))}

        {/* lifelines + message arrows */}
        <svg className="absolute left-0 top-0" width={width} height={height}>
          <defs>
            <marker id="arrow-solid" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 Z" fill="#334155" />
            </marker>
            <marker id="arrow-dashed" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 Z" fill="#94a3b8" />
            </marker>
          </defs>

          {data.actors.map((actor) => (
            <line
              key={actor.id}
              x1={actorX.get(actor.id)}
              x2={actorX.get(actor.id)}
              y1={headerHeight}
              y2={height - 10}
              stroke="#cbd5e1"
              strokeWidth={1}
              strokeDasharray="3 4"
            />
          ))}

          {data.messages.map((message, index) => {
            if (message.self) return null;
            const x1 = actorX.get(message.from) ?? 0;
            const x2 = actorX.get(message.to) ?? 0;
            const y = messageY[index];
            const dashed = message.style === 'dashed';
            return (
              <line
                key={message.id}
                x1={x1}
                x2={x2}
                y1={y}
                y2={y}
                stroke={dashed ? '#94a3b8' : '#334155'}
                strokeWidth={1.5}
                strokeDasharray={dashed ? '5 4' : undefined}
                markerEnd={dashed ? 'url(#arrow-dashed)' : 'url(#arrow-solid)'}
              />
            );
          })}
        </svg>

        {/* message labels + self-message notes + icons */}
        {data.messages.map((message, index) => {
          const y = messageY[index];
          const Icon = message.icon ? ICONS[message.icon] : null;

          if (message.self) {
            const x = actorX.get(message.from) ?? 0;
            return (
              <div
                key={message.id}
                className="absolute flex -translate-y-1/2 items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-medium text-slate-600 shadow-sm"
                style={{ left: x + 16, top: y }}
              >
                {Icon && <Icon className="h-3 w-3 shrink-0 text-slate-400" />}
                {message.label}
              </div>
            );
          }

          const x1 = actorX.get(message.from) ?? 0;
          const x2 = actorX.get(message.to) ?? 0;
          const midX = (x1 + x2) / 2;

          return (
            <div key={message.id}>
              <div
                className="absolute -translate-x-1/2 -translate-y-full whitespace-nowrap bg-white px-1.5 text-[11px] text-slate-600"
                style={{ left: midX, top: y - 3 }}
              >
                {message.label}
              </div>
              {(Icon || message.note) && (
                <div
                  className="absolute flex -translate-x-1/2 flex-col items-center gap-0.5"
                  style={{ left: midX, top: y + 6 }}
                >
                  {Icon && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-fuchsia-100 text-fuchsia-600">
                      <Icon className="h-3 w-3" />
                    </span>
                  )}
                  {message.note && (
                    <span className="whitespace-nowrap text-[9px] uppercase tracking-wide text-slate-400">
                      {message.note}
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* annotations */}
        {data.annotations.map((annotation) => (
          <div
            key={annotation.id}
            className={cn(
              'absolute w-48 -translate-x-1/2 -translate-y-full rounded-md border border-violet-200 bg-violet-50 p-2.5 text-[11px] leading-snug text-violet-900 shadow-sm',
            )}
            style={{ left: actorX.get(annotation.actorId), top: (annotationY.get(annotation.id) ?? 0) - 20 }}
          >
            {annotation.text}
          </div>
        ))}
      </div>
    </div>
  );
}
