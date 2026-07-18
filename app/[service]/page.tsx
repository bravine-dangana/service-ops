import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { services, getServiceBySlug } from '@/data/services';
import { ServiceIcon } from '@/components/ServiceIcon';
import { RoadmapCanvas } from '@/components/roadmap/RoadmapCanvas';

export function generateStaticParams() {
  return services.map((service) => ({ service: service.slug }));
}

export function generateMetadata({ params }: { params: { service: string } }) {
  const service = getServiceBySlug(params.service);
  return { title: service ? `${service.name} · Service Ops Platform` : 'Service Ops Platform' };
}

export default function ServiceFlowPage({ params }: { params: { service: string } }) {
  const service = getServiceBySlug(params.service);

  if (!service) {
    notFound();
  }

  return (
    <div className="bg-slate-50">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-slate-500 transition hover:text-cellulant-blue"
        >
          <ArrowLeft className="h-4 w-4" />
          All services
        </Link>

        <div className="mb-10 flex items-center gap-4">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-xl"
            style={{ backgroundColor: `${service.accent}1a` }}
          >
            <ServiceIcon icon={service.icon} className="h-6 w-6" style={{ color: service.accent }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">{service.name}</h1>
            <p className="mt-1 text-sm text-slate-500">{service.description}</p>
          </div>
        </div>

        <RoadmapCanvas service={service} />
      </div>
    </div>
  );
}
