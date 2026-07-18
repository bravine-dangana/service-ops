import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" aria-label="Cellulant" className="flex items-center">
      <span className="text-xl font-extrabold tracking-tight text-white">
        Cellul<span className="text-cellulant-blue">ant</span>
      </span>
    </Link>
  );
}
