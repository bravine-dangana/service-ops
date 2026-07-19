import { getAllCustomerFlows, getAllServices } from '@/lib/queries';
import { CustomerFlowManager } from '@/components/admin/CustomerFlowManager';

export const dynamic = 'force-dynamic';

export default async function AdminCustomersPage() {
  const [flows, services] = await Promise.all([getAllCustomerFlows(), getAllServices()]);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Customer flows</h1>
      <CustomerFlowManager
        flows={flows}
        services={services.map((s) => ({ slug: s.slug, name: s.name }))}
      />
    </div>
  );
}
