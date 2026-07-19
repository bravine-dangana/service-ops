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

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const guard = await requireAdminApi();
  if (guard.error) return guard.error;

  const flow = await prisma.customerFlow.findUnique({ where: { id: params.id } });
  if (!flow) return NextResponse.json({ error: 'Not found.' }, { status: 404 });

  return NextResponse.json(flow);
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const guard = await requireAdminApi();
  if (guard.error) return guard.error;

  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'Invalid body.' }, { status: 400 });

  const data: Record<string, unknown> = {};
  if (typeof body.name === 'string' && body.name.trim()) data.name = body.name.trim();
  if (typeof body.serviceSlug === 'string' && body.serviceSlug) data.serviceSlug = body.serviceSlug;
  if (typeof body.dataJson === 'string') {
    if (!isValidDiagramJson(body.dataJson)) {
      return NextResponse.json(
        { error: 'Diagram JSON must include actors, messages, and annotations arrays.' },
        { status: 400 },
      );
    }
    data.dataJson = body.dataJson;
  }

  const flow = await prisma.customerFlow.update({ where: { id: params.id }, data });
  return NextResponse.json(flow);
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const guard = await requireAdminApi();
  if (guard.error) return guard.error;

  await prisma.customerFlow.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
