import Link from 'next/link';
import { getAllServices } from '@/lib/queries';

export const dynamic = 'force-dynamic';

export default async function AdminServicesPage() {
  const services = await getAllServices();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Services & steps</h1>
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
            <tr>
              <th className="px-4 py-3">Service</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Steps</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service.slug} className="border-t border-slate-100">
                <td className="px-4 py-3 font-medium text-slate-900">{service.name}</td>
                <td className="px-4 py-3 text-slate-500">{service.slug}</td>
                <td className="px-4 py-3 text-slate-500">{service.steps.length}</td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/services/${service.slug}`}
                    className="text-cellulant-blue hover:underline"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
