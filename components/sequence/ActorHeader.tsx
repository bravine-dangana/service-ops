import { User, Cloud, Server } from 'lucide-react';
import type { SequenceActor } from '@/lib/sequence-diagram';

export function ActorHeader({ actor }: { actor: SequenceActor }) {
  const Icon = actor.kind === 'person' ? User : actor.kind === 'cloud' ? Cloud : Server;

  return (
    <div
      className="flex w-[130px] items-center justify-center gap-1.5 rounded-md border-2 border-black px-2 py-2 text-center text-[11px] font-semibold leading-snug shadow-sm"
      style={{ backgroundColor: actor.color, color: actor.textColor ?? '#ffffff' }}
      title={actor.label}
    >
      <Icon className="h-3.5 w-3.5 shrink-0" />
      <span className="truncate">{actor.label}</span>
    </div>
  );
}
