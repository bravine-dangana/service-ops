import { NextResponse } from 'next/server';
import { getCurrentUser } from './session';

export async function requireAdminApi() {
  const user = await getCurrentUser();
  if (!user) {
    return { error: NextResponse.json({ error: 'Not authenticated.' }, { status: 401 }) } as const;
  }
  if (user.role !== 'admin') {
    return { error: NextResponse.json({ error: 'Not authorized.' }, { status: 403 }) } as const;
  }
  return { user } as const;
}
