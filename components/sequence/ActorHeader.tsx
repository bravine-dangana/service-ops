import { User, Cloud, Server } from 'lucide-react';
import type { SequenceActor } from '@/lib/sequence-diagram';

export function ActorHeader({ actor }: { actor: SequenceActor }) {
  const Icon = actor.kind === 'person' ? User : actor.kind === 'cloud' ? Cloud : Server;

  return (
    <div className="flex w-[130px] flex-col items-center gap-1.5 text-center">
      <span
        className="flex h-8 w-8 items-center justify-center rounded-full text-white shadow-sm"
        style={{ backgroundColor: actor.color }}
      >
        <Icon className="h-4 w-4" />
      </span>
      {actor.kind === 'service' ? (
        <span
          className="w-full truncate rounded px-1.5 py-1 text-[11px] font-semibold text-white"
          style={{ backgroundColor: actor.color }}
          title={actor.label}
        >
          {actor.label}
        </span>
      ) : (
        <span className="text-[11px] font-medium leading-tight text-slate-600">{actor.label}</span>
      )}
    </div>
  );
}
