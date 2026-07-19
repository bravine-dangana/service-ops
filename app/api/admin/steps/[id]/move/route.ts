import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminApi } from '@/lib/require-admin-api';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const guard = await requireAdminApi();
  if (guard.error) return guard.error;

  const body = await request.json().catch(() => null);
  const direction = body?.direction;
  if (direction !== 'up' && direction !== 'down') {
    return NextResponse.json({ error: 'direction must be "up" or "down".' }, { status: 400 });
  }

  const current = await prisma.step.findUnique({ where: { id: params.id } });
  if (!current) {
    return NextResponse.json({ error: 'Step not found.' }, { status: 404 });
  }

  const siblings = await prisma.step.findMany({
    where: { serviceSlug: current.serviceSlug },
    orderBy: { order: 'asc' },
  });
  const index = siblings.findIndex((s) => s.id === current.id);
  const neighborIndex = direction === 'up' ? index - 1 : index + 1;
  const neighbor = siblings[neighborIndex];

  if (!neighbor) {
    return NextResponse.json({ error: 'Already at the edge.' }, { status: 400 });
  }

  await prisma.$transaction([
    prisma.step.update({ where: { id: current.id }, data: { order: neighbor.order } }),
    prisma.step.update({ where: { id: neighbor.id }, data: { order: current.order } }),
  ]);

  return NextResponse.json({ ok: true });
}
