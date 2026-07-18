'use client';

import { useEffect, useRef, useState } from 'react';
import { Workflow, Zap, Database, Play, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { layoutSequenceDiagram, type SequenceDiagramData, type SystemIcon } from '@/lib/sequence-diagram';
import { ActorHeader } from './ActorHeader';
import { SidePanel } from '../SidePanel';

const ICONS: Record<SystemIcon, typeof Workflow> = {
  queue: Workflow,
  cache: Zap,
  database: Database,
};

const STEP_DURATION_MS = 700;
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 1.5;

export function SequenceDiagram({ data }: { data: SequenceDiagramData }) {
  const { actorX, messageY, annotationY, width, height, headerHeight } = layoutSequenceDiagram(data);

  const [zoom, setZoom] = useState(1);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  function play() {
    if (playing) return;
    setPlaying(true);
    setActiveIndex(0);
    let step = 0;
    intervalRef.current = setInterval(() => {
      step += 1;
      if (step >= data.messages.length) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setPlaying(false);
        setTimeout(() => setActiveIndex(null), 1200);
        return;
      }
      setActiveIndex(step);
    }, STEP_DURATION_MS);
  }

  const activeMessage = activeIndex !== null ? data.messages[activeIndex] : null;
  const traveler = activeMessage
    ? activeMessage.self
      ? { x: (actorX.get(activeMessage.from) ?? 0) + 16, y: messageY[activeIndex as number] }
      : { x: actorX.get(activeMessage.to) ?? 0, y: messageY[activeIndex as number] }
    : null;

  const firstActorId = data.actors[0]?.id;
  const selectedMessage = selectedMessageId
    ? data.messages.find((m) => m.id === selectedMessageId) ?? null
    : null;

  return (
    <div className="w-full rounded-xl border border-slate-200 bg-white p-6">
      <div className="mb-4 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setZoom((z) => Math.max(MIN_ZOOM, +(z - 0.1).toFixed(2)))}
          className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-900"
          aria-label="Zoom out"
        >
          <ZoomOut className="h-3.5 w-3.5" />
        </button>
        <span className="w-12 text-center text-xs font-medium text-slate-500">{Math.round(zoom * 100)}%</span>
        <button
          type="button"
          onClick={() => setZoom((z) => Math.min(MAX_ZOOM, +(z + 0.1).toFixed(2)))}
          className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-900"
          aria-label="Zoom in"
        >
          <ZoomIn className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => setZoom(1)}
          className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-900"
          aria-label="Reset zoom"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="w-full overflow-auto">
        <div style={{ width: width * zoom, height: height * zoom }}>
          <div
            className="relative origin-top-left"
            style={{ width, height, transform: `scale(${zoom})` }}
          >
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

            {/* initiate button, under the first actor */}
            <button
              type="button"
              onClick={play}
              disabled={playing}
              className="absolute -translate-x-1/2 whitespace-nowrap rounded-full bg-cellulant-blue px-3 py-1 text-[11px] font-semibold text-white shadow transition hover:bg-cellulant-navy disabled:cursor-not-allowed disabled:opacity-60"
              style={{ left: actorX.get(firstActorId), top: headerHeight - 22 }}
            >
              <span className="inline-flex items-center gap-1">
                <Play className="h-3 w-3" />
                {playing ? 'Running…' : (data.initiateLabel ?? 'Initiate Payment')}
              </span>
            </button>

            {/* lifelines + message arrows */}
            <svg className="absolute left-0 top-0" width={width} height={height}>
              <defs>
                <marker id="arrow-solid" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                  <path d="M0,0 L8,4 L0,8 Z" fill="#334155" />
                </marker>
                <marker id="arrow-dashed" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                  <path d="M0,0 L8,4 L0,8 Z" fill="#94a3b8" />
                </marker>
                <marker id="arrow-active" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                  <path d="M0,0 L8,4 L0,8 Z" fill="#ef4444" />
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
                const isActive = index === activeIndex;
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
                    stroke={isActive ? '#ef4444' : dashed ? '#94a3b8' : '#334155'}
                    strokeWidth={isActive ? 2.5 : 1.5}
                    strokeDasharray={dashed && !isActive ? '5 4' : undefined}
                    markerEnd={isActive ? 'url(#arrow-active)' : dashed ? 'url(#arrow-dashed)' : 'url(#arrow-solid)'}
                  />
                );
              })}
            </svg>

            {/* message labels + self-message notes + icons */}
            {data.messages.map((message, index) => {
              const y = messageY[index];
              const Icon = message.icon ? ICONS[message.icon] : null;
              const isActive = index === activeIndex;

              if (message.self) {
                const x = actorX.get(message.from) ?? 0;
                return (
                  <button
                    key={message.id}
                    type="button"
                    onClick={() => setSelectedMessageId(message.id)}
                    className={cn(
                      'absolute flex -translate-y-1/2 items-center gap-1.5 rounded-md border-2 border-black px-2 py-1 text-[11px] font-semibold shadow-sm transition hover:brightness-95',
                      isActive ? 'bg-red-100' : 'bg-white text-slate-700',
                    )}
                    style={{ left: x + 16, top: y }}
                  >
                    {Icon && <Icon className="h-3 w-3 shrink-0 text-slate-500" />}
                    {message.label}
                  </button>
                );
              }

              const x1 = actorX.get(message.from) ?? 0;
              const x2 = actorX.get(message.to) ?? 0;
              const midX = (x1 + x2) / 2;

              return (
                <div key={message.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedMessageId(message.id)}
                    className={cn(
                      'absolute -translate-x-1/2 -translate-y-full whitespace-nowrap rounded border px-1.5 py-0.5 text-[11px] font-medium shadow-sm transition hover:brightness-95',
                      isActive
                        ? 'border-red-300 bg-red-50 text-red-700'
                        : 'border-slate-200 bg-white text-slate-600',
                    )}
                    style={{ left: midX, top: y - 4 }}
                  >
                    {message.label}
                  </button>
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
                className="absolute w-48 -translate-x-1/2 -translate-y-full rounded-md border border-violet-200 bg-violet-50 p-2.5 text-[11px] leading-snug text-violet-900 shadow-sm"
                style={{ left: actorX.get(annotation.actorId), top: (annotationY.get(annotation.id) ?? 0) - 20 }}
              >
                {annotation.text}
              </div>
            ))}

            {/* animated traveler */}
            {traveler && (
              <div
                className="absolute z-20 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500 shadow-[0_0_0_5px_rgba(239,68,68,0.25)] transition-all ease-linear"
                style={{ left: traveler.x, top: traveler.y, transitionDuration: `${STEP_DURATION_MS}ms` }}
              />
            )}
          </div>
        </div>
      </div>

      {selectedMessage && (
        <SidePanel
          step={{
            id: selectedMessage.id,
            title: selectedMessage.label,
            explanation:
              selectedMessage.detail ??
              selectedMessage.note ??
              'No additional detail yet — add it from the admin page.',
            status: 'draft',
          }}
          index={data.messages.findIndex((m) => m.id === selectedMessage.id)}
          total={data.messages.length}
          accent="#4135D6"
          isReviewed={false}
          showReviewToggle={false}
          onToggleReviewed={() => {}}
          onClose={() => setSelectedMessageId(null)}
        />
      )}
    </div>
  );
}
