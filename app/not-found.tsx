import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-6 text-center">
      <h1 className="text-2xl font-bold text-white">Service not found</h1>
      <p className="mt-2 text-sm text-slate-400">
        That service doesn’t exist yet on the Service Ops Platform.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-white/25 hover:text-white"
      >
        Back to all services
      </Link>
    </div>
  );
}
