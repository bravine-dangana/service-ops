import { prisma } from './prisma';
import type { ServiceDefinition, StepStatus, StepRole } from '@/data/services';
import type { SequenceDiagramData } from './sequence-diagram';

type ServiceWithSteps = Awaited<ReturnType<typeof prisma.service.findMany>>[number] & {
  steps: Awaited<ReturnType<typeof prisma.step.findMany>>;
};

function toServiceDefinition(row: ServiceWithSteps): ServiceDefinition {
  return {
    slug: row.slug,
    name: row.name,
    tagline: row.tagline,
    description: row.description,
    accent: row.accent,
    icon: row.icon as ServiceDefinition['icon'],
    isExample: row.isExample,
    steps: row.steps.map((step) => ({
      id: step.id,
      title: step.title,
      explanation: step.explanation,
      status: step.status as StepStatus,
      role: step.role as StepRole,
    })),
  };
}

export async function getAllServices(): Promise<ServiceDefinition[]> {
  const rows = await prisma.service.findMany({
    orderBy: { order: 'asc' },
    include: { steps: { orderBy: { order: 'asc' } } },
  });
  return rows.map(toServiceDefinition);
}

export async function getServiceBySlugDb(slug: string): Promise<ServiceDefinition | null> {
  const row = await prisma.service.findUnique({
    where: { slug },
    include: { steps: { orderBy: { order: 'asc' } } },
  });
  return row ? toServiceDefinition(row) : null;
}

export interface CustomerFlowSummary {
  id: string;
  name: string;
  slug: string;
  serviceSlug: string;
  serviceName: string;
}

export async function getAllCustomerFlows(): Promise<CustomerFlowSummary[]> {
  const rows = await prisma.customerFlow.findMany({
    include: { service: true },
    orderBy: { createdAt: 'asc' },
  });
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    serviceSlug: row.serviceSlug,
    serviceName: row.service.name,
  }));
}

export async function getCustomerFlowsForService(serviceSlug: string): Promise<CustomerFlowSummary[]> {
  const rows = await prisma.customerFlow.findMany({
    where: { serviceSlug },
    include: { service: true },
    orderBy: { createdAt: 'asc' },
  });
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    serviceSlug: row.serviceSlug,
    serviceName: row.service.name,
  }));
}

export async function getCustomerFlowBySlug(
  slug: string,
): Promise<{ id: string; name: string; slug: string; serviceSlug: string; data: SequenceDiagramData } | null> {
  const row = await prisma.customerFlow.findUnique({ where: { slug } });
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    serviceSlug: row.serviceSlug,
    data: JSON.parse(row.dataJson) as SequenceDiagramData,
  };
}
