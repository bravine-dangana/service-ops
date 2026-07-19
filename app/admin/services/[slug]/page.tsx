import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getServiceBySlugDb } from '@/lib/queries';
import { ServiceEditor } from '@/components/admin/ServiceEditor';

export const dynamic = 'force-dynamic';

export default async function AdminServiceEditPage({ params }: { params: { slug: string } }) {
  const service = await getServiceBySlugDb(params.slug);

  if (!service) {
    notFound();
  }

  return (
    <div>
      <Link
        href="/admin/services"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-cellulant-blue"
      >
        <ArrowLeft className="h-4 w-4" />
        All services
      </Link>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">{service.name}</h1>
      <ServiceEditor service={service} />
    </div>
  );
}
