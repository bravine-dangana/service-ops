import { services } from '@/data/services';
import { FeaturedItems } from '@/components/site/FeaturedItems';

const paymentFlows = [
  ...services.map((service) => ({
    text: service.name,
    href: `/${service.slug}`,
    isNew: service.isExample,
  })),
  { text: 'Checkout — Customer XXXX', href: '/checkout-customer-xxxx', isNew: true },
];

const platformItems = [
  { text: 'Global API Payouts', href: '#', isUpcoming: true },
  { text: 'Observability', href: '#', isUpcoming: true },
  { text: 'Checkout Global API', href: '#', isUpcoming: true },
  { text: 'Security', href: '#', isUpcoming: true },
  { text: 'Infrastructure', href: '#', isUpcoming: true },
];

export default function HomePage() {
  return (
    <div className="bg-gradient-to-b from-cellulant-dark2 to-cellulant-dark">
      <div className="relative min-h-[192px] border-b border-white/10 transition-all sm:min-h-[281px]">
        <div className="container px-5 py-6 pb-14 text-left transition-opacity duration-300 sm:px-0 sm:py-20 sm:text-center">
          <h1 className="mb-2 bg-gradient-to-r from-white to-cellulant-blue bg-clip-text text-2xl font-extrabold text-transparent sm:mb-4 sm:text-5xl sm:leading-tight">
            Welcome to Service Ops
          </h1>
          <p className="hidden px-4 text-lg text-slate-300 sm:block">
            <span className="font-medium text-white">Service Ops</span> is Cellulant&rsquo;s
            interactive knowledge base of payment services — see the journey of a transaction
            visually, click any step, and understand what happens there.
          </p>
          <p className="text-md block px-0 text-slate-300 sm:hidden">
            An interactive knowledge base of Cellulant&rsquo;s payment services.
          </p>
        </div>
      </div>

      <FeaturedItems id="payment-flows" heading="Payment Flows" items={paymentFlows} />
      <FeaturedItems id="platform" heading="Platform & Infrastructure" items={platformItems} />
    </div>
  );
}
