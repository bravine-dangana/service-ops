import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { services, getServiceBySlug } from '@/data/services';
import { ServiceIcon } from '@/components/ServiceIcon';
import { RoadmapCanvas } from '@/components/roadmap/RoadmapCanvas';
import { RoadmapSidebar } from '@/components/roadmap/RoadmapSidebar';
import { ShareIcons } from '@/components/roadmap/ShareIcons';
import { InfoAccordion } from '@/components/roadmap/InfoAccordion';
import { FloatingAssistantBar } from '@/components/roadmap/FloatingAssistantBar';

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
    <div className="bg-slate-50 pb-24">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-slate-500 transition hover:text-cellulant-blue"
        >
          <ArrowLeft className="h-4 w-4" />
          All services
        </Link>

        <div className="mb-6 flex items-center gap-4">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-xl"
            style={{ backgroundColor: `${service.accent}1a` }}
          >
            <ServiceIcon icon={service.icon} className="h-6 w-6" style={{ color: service.accent }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">{service.name}</h1>
            <p className="mt-1 text-sm text-slate-500">{service.tagline}</p>
          </div>
        </div>

        <InfoAccordion name={service.name} description={service.description} />

        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="sticky top-24 hidden h-fit shrink-0 lg:block">
            <ShareIcons />
          </div>

          <div className="w-full shrink-0 lg:sticky lg:top-24 lg:h-fit lg:w-64">
            <RoadmapSidebar service={service} />
          </div>

          <div className="min-w-0 flex-1">
            <RoadmapCanvas service={service} />
          </div>
        </div>
      </div>

      <FloatingAssistantBar />
    </div>
  );
}
