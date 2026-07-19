'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface UserRow {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: string;
}

export function UsersTable({ users }: { users: UserRow[] }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function toggleRole(user: UserRow) {
    setError(null);
    setBusyId(user.id);
    const nextRole = user.role === 'admin' ? 'viewer' : 'admin';
    const res = await fetch(`/api/admin/users/${user.id}/role`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: nextRole }),
    });
    setBusyId(null);
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? 'Failed to update role.');
      return;
    }
    router.refresh();
  }

  return (
    <div>
      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const isSelf = session?.user?.id === user.id;
              return (
                <tr key={user.id} className="border-t border-slate-100">
                  <td className="px-4 py-3 text-slate-700">{user.name || '—'}</td>
                  <td className="px-4 py-3 text-slate-700">{user.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        user.role === 'admin'
                          ? 'rounded-full bg-cellulant-blue/10 px-2 py-0.5 text-xs font-medium text-cellulant-blue'
                          : 'rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500'
                      }
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {isSelf ? (
                      <span className="text-xs text-slate-300">You</span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => toggleRole(user)}
                        disabled={busyId === user.id}
                        className="text-xs text-cellulant-blue hover:underline disabled:opacity-60"
                      >
                        {user.role === 'admin' ? 'Revoke admin' : 'Make admin'}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
