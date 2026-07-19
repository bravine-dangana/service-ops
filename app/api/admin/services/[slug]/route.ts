import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminApi } from '@/lib/require-admin-api';

export async function PATCH(request: Request, { params }: { params: { slug: string } }) {
  const guard = await requireAdminApi();
  if (guard.error) return guard.error;

  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'Invalid body.' }, { status: 400 });

  const data: Record<string, unknown> = {};
  for (const key of ['name', 'tagline', 'description', 'accent', 'icon'] as const) {
    if (typeof body[key] === 'string') data[key] = body[key];
  }
  if (typeof body.isExample === 'boolean') data.isExample = body.isExample;

  const service = await prisma.service.update({
    where: { slug: params.slug },
    data,
  });

  return NextResponse.json(service);
}
