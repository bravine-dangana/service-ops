import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminApi } from '@/lib/require-admin-api';

function isValidDiagramJson(raw: string) {
  try {
    const parsed = JSON.parse(raw);
    return (
      parsed &&
      Array.isArray(parsed.actors) &&
      Array.isArray(parsed.messages) &&
      Array.isArray(parsed.annotations)
    );
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  const guard = await requireAdminApi();
  if (guard.error) return guard.error;

  const body = await request.json().catch(() => null);
  const serviceSlug = typeof body?.serviceSlug === 'string' ? body.serviceSlug : '';
  const name = typeof body?.name === 'string' ? body.name.trim() : '';
  const slug = typeof body?.slug === 'string' ? body.slug.trim().toLowerCase() : '';
  const dataJson = typeof body?.dataJson === 'string' ? body.dataJson : '';

  if (!serviceSlug || !name || !slug) {
    return NextResponse.json({ error: 'Service, name, and slug are all required.' }, { status: 400 });
  }
  if (!isValidDiagramJson(dataJson)) {
    return NextResponse.json(
      { error: 'Diagram JSON must include actors, messages, and annotations arrays.' },
      { status: 400 },
    );
  }

  const existing = await prisma.customerFlow.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json({ error: 'That slug is already in use.' }, { status: 409 });
  }

  const flow = await prisma.customerFlow.create({
    data: { serviceSlug, name, slug, dataJson },
  });

  return NextResponse.json(flow);
}
