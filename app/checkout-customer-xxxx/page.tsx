import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { customerXxxxCheckout } from '@/lib/sequence-diagram';
import { SequenceDiagram } from '@/components/sequence/SequenceDiagram';

export const metadata = {
  title: 'Customer XXXX — Checkout · Service Ops Platform',
};

export default function CustomerXxxxCheckoutPage() {
  return (
    <div className="bg-slate-50 pb-24">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <Link
          href="/#payment-flows"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-slate-500 transition hover:text-cellulant-blue"
        >
          <ArrowLeft className="h-4 w-4" />
          All services
        </Link>

        <div className="mb-2">
          <span className="inline-flex items-center rounded-full border border-cellulant-blue/30 bg-cellulant-blue/10 px-2.5 py-0.5 text-xs font-medium text-cellulant-blue">
            Checkout
          </span>
        </div>
        <h1 className="mb-2 text-2xl font-bold text-slate-900 sm:text-3xl">Customer XXXX</h1>
        <p className="mb-8 max-w-2xl text-sm text-slate-500">
          A real customer&rsquo;s Checkout integration — Airtel Money charge and query-status flow,
          including the queueing, caching, and reconciliation layers behind it. Reconstructed from an
          internal architecture diagram; for the general, plain-language explanation of how Checkout
          works, see the{' '}
          <Link href="/checkout" className="text-cellulant-blue hover:underline">
            Checkout service page
          </Link>
          .
        </p>

        <SequenceDiagram data={customerXxxxCheckout} />

        <p className="mt-4 text-xs text-slate-400">
          Best-effort reconstruction from a shared architecture screenshot — some labels and ordering
          are approximate. Let the Checkout product team confirm before treating this as authoritative.
        </p>
      </div>
    </div>
  );
}
