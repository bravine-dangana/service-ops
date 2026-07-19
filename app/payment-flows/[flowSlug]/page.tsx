import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { getCustomerFlowBySlug, getServiceBySlugDb } from '@/lib/queries';
import { SequenceDiagram } from '@/components/sequence/SequenceDiagram';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { flowSlug: string } }) {
  const flow = await getCustomerFlowBySlug(params.flowSlug);
  return { title: flow ? `${flow.name} · Service Ops Platform` : 'Service Ops Platform' };
}

export default async function CustomerFlowPage({ params }: { params: { flowSlug: string } }) {
  const flow = await getCustomerFlowBySlug(params.flowSlug);

  if (!flow) {
    notFound();
  }

  const service = await getServiceBySlugDb(flow.serviceSlug);

  return (
    <div className="bg-slate-50 pb-24">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <Link
          href={service ? `/${service.slug}` : '/payment-flows'}
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-slate-500 transition hover:text-cellulant-blue"
        >
          <ArrowLeft className="h-4 w-4" />
          {service ? `Back to ${service.name}` : 'Back to Payment Flows'}
        </Link>

        {service && (
          <div className="mb-2">
            <span className="inline-flex items-center rounded-full border border-cellulant-blue/30 bg-cellulant-blue/10 px-2.5 py-0.5 text-xs font-medium text-cellulant-blue">
              {service.name}
            </span>
          </div>
        )}
        <h1 className="mb-2 text-2xl font-bold text-slate-900 sm:text-3xl">{flow.name}</h1>
        <p className="mb-8 max-w-2xl text-sm text-slate-500">
          A real customer&rsquo;s technical implementation, reconstructed from an internal
          architecture diagram.{' '}
          {service && (
            <>
              For the general, plain-language explanation, see the{' '}
              <Link href={`/${service.slug}`} className="text-cellulant-blue hover:underline">
                {service.name} service page
              </Link>
              .
            </>
          )}
        </p>

        <SequenceDiagram data={flow.data} />

        <p className="mt-4 text-xs text-slate-400">
          Content managed from the admin page — labels and ordering may need review before being
          treated as authoritative.
        </p>
      </div>
    </div>
  );
}
