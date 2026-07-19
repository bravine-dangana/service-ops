import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/session';

const NAV = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/services', label: 'Services & steps' },
  { href: '/admin/customers', label: 'Customer flows' },
  { href: '/admin/users', label: 'Users' },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/signin?callbackUrl=/admin');
  }

  if (user.role !== 'admin') {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center bg-slate-50 px-6 text-center">
        <h1 className="text-xl font-bold text-slate-900">Not authorized</h1>
        <p className="mt-2 text-sm text-slate-500">
          Your account ({user.email}) doesn&rsquo;t have admin access yet. Ask an existing admin to
          grant it to you from the Users page.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] bg-slate-50">
      <div className="mx-auto flex max-w-6xl gap-8 px-6 py-10">
        <aside className="w-48 shrink-0">
          <nav className="flex flex-col gap-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-white hover:text-cellulant-blue"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
