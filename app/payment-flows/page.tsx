import { getAllCustomerFlows } from '@/lib/queries';
import { FeaturedItems } from '@/components/site/FeaturedItems';

export const metadata = {
  title: 'Payment Flows · Service Ops Platform',
};

export const dynamic = 'force-dynamic';

export default async function PaymentFlowsPage() {
  const flows = await getAllCustomerFlows();
  const items = flows.map((flow) => ({
    text: `${flow.serviceName} — ${flow.name}`,
    href: `/payment-flows/${flow.slug}`,
    isNew: true,
  }));

  return (
    <div className="min-h-[70vh] bg-gradient-to-b from-cellulant-dark2 to-cellulant-dark pb-16">
      <div className="relative border-b border-white/10 py-14">
        <div className="container text-center">
          <h1 className="mb-2 text-2xl font-extrabold text-white sm:text-4xl">Payment Flows</h1>
          <p className="mx-auto max-w-2xl text-sm text-slate-300 sm:text-base">
            Real customer payment-flow implementations — the actual technical diagrams behind live
            integrations, not the generic service walkthroughs. For how a service works in general,
            see its page under{' '}
            <a href="/#services" className="text-cellulant-blue hover:underline">
              Services
            </a>
            .
          </p>
        </div>
      </div>

      {items.length > 0 ? (
        <FeaturedItems heading="Customer implementations" items={items} />
      ) : (
        <div className="container py-14 text-center text-sm text-slate-400">
          No customer flow diagrams have been added yet.
        </div>
      )}
    </div>
  );
}
