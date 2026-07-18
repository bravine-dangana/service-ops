import Link from 'next/link';
import { cn } from '@/lib/utils';

export interface FeaturedItemType {
  text: string;
  href: string;
  isNew?: boolean;
  isUpcoming?: boolean;
}

export function FeaturedItem({ text, href, isNew, isUpcoming }: FeaturedItemType) {
  const className = cn(
    'group relative block overflow-hidden rounded-lg border border-white/10 bg-white/5 p-2.5 text-md font-normal text-slate-300 no-underline hover:border-cellulant-blue/60 hover:bg-white/10 hover:text-white sm:p-3.5',
    isUpcoming && 'pointer-events-none opacity-50',
  );

  const content = (
    <>
      <span className="relative z-20">{text}</span>

      {isNew && (
        <span className="absolute bottom-1.5 right-2 flex items-center text-xs font-medium text-tingg-green">
          <span className="mr-1.5 flex h-2 w-2">
            <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-tingg-green opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-tingg-green" />
          </span>
          New
        </span>
      )}

      {isUpcoming && (
        <span className="absolute bottom-1.5 right-2 flex items-center text-xs font-medium text-slate-400">
          <span className="mr-1.5 flex h-2 w-2">
            <span className="relative inline-flex h-2 w-2 rounded-full bg-slate-300" />
          </span>
          Upcoming
        </span>
      )}
    </>
  );

  if (isUpcoming) {
    return <span className={className}>{content}</span>;
  }

  return (
    <Link href={href} className={className}>
      {content}
    </Link>
  );
}
