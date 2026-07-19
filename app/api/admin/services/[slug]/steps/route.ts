import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminApi } from '@/lib/require-admin-api';

function slugifyId(serviceSlug: string, title: string) {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  return `${serviceSlug}-${base || 'step'}-${Date.now().toString(36)}`;
}

export async function POST(request: Request, { params }: { params: { slug: string } }) {
  const guard = await requireAdminApi();
  if (guard.error) return guard.error;

  const body = await request.json().catch(() => null);
  const title = typeof body?.title === 'string' ? body.title.trim() : '';
  const explanation = typeof body?.explanation === 'string' ? body.explanation.trim() : '';
  const status = body?.status === 'reviewed' ? 'reviewed' : 'draft';
  const role = ['customer', 'external', 'cellulant', 'success', 'failure'].includes(body?.role)
    ? body.role
    : 'cellulant';

  if (!title) {
    return NextResponse.json({ error: 'Title is required.' }, { status: 400 });
  }

  const maxOrder = await prisma.step.aggregate({
    where: { serviceSlug: params.slug },
    _max: { order: true },
  });

  const step = await prisma.step.create({
    data: {
      id: slugifyId(params.slug, title),
      serviceSlug: params.slug,
      order: (maxOrder._max.order ?? -1) + 1,
      title,
      explanation,
      status,
      role,
    },
  });

  return NextResponse.json(step);
}
