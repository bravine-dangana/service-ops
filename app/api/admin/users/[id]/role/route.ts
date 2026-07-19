import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminApi } from '@/lib/require-admin-api';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const guard = await requireAdminApi();
  if (guard.error) return guard.error;

  if (guard.user.id === params.id) {
    return NextResponse.json(
      { error: "You can't change your own role — ask another admin to do it." },
      { status: 400 },
    );
  }

  const body = await request.json().catch(() => null);
  if (body?.role !== 'admin' && body?.role !== 'viewer') {
    return NextResponse.json({ error: 'Role must be "admin" or "viewer".' }, { status: 400 });
  }

  const user = await prisma.user.update({
    where: { id: params.id },
    data: { role: body.role },
  });

  return NextResponse.json({ id: user.id, role: user.role });
}
