import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const [serviceCount, stepCount, flowCount, userCount] = await Promise.all([
    prisma.service.count(),
    prisma.step.count(),
    prisma.customerFlow.count(),
    prisma.user.count(),
  ]);

  const cards = [
    { label: 'Services', value: serviceCount, href: '/admin/services' },
    { label: 'Steps', value: stepCount, href: '/admin/services' },
    { label: 'Customer flows', value: flowCount, href: '/admin/customers' },
    { label: 'Users', value: userCount, href: '/admin/users' },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Admin</h1>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-cellulant-blue"
          >
            <p className="text-2xl font-bold text-slate-900">{card.value}</p>
            <p className="text-sm text-slate-500">{card.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
