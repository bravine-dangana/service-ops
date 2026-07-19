import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminApi } from '@/lib/require-admin-api';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const guard = await requireAdminApi();
  if (guard.error) return guard.error;

  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'Invalid body.' }, { status: 400 });

  const data: Record<string, unknown> = {};
  if (typeof body.title === 'string') data.title = body.title;
  if (typeof body.explanation === 'string') data.explanation = body.explanation;
  if (body.status === 'draft' || body.status === 'reviewed') data.status = body.status;
  if (['customer', 'external', 'cellulant', 'success', 'failure'].includes(body.role)) {
    data.role = body.role;
  }
  if (typeof body.order === 'number') data.order = body.order;

  const step = await prisma.step.update({ where: { id: params.id }, data });
  return NextResponse.json(step);
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const guard = await requireAdminApi();
  if (guard.error) return guard.error;

  await prisma.step.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
