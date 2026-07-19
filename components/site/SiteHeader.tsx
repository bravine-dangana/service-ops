'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Menu, X, LogIn, ShieldCheck, LogOut } from 'lucide-react';
import { Logo } from './Logo';

const NAV_LINKS = [
  { text: 'Payment Flows', href: '/payment-flows' },
  { text: 'Platform & Infrastructure', href: '/#platform' },
];

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: session, status } = useSession();
  const isAuthed = status === 'authenticated';
  const isAdmin = session?.user?.role === 'admin';

  return (
    <div className="sticky top-0 z-30 px-4 pt-4">
      <nav className="container flex items-center justify-between rounded-full border border-white/10 bg-cellulant-dark/90 px-5 py-2.5 shadow-lg backdrop-blur">
        <div className="flex items-center gap-6">
          <Logo />
          <div className="hidden gap-6 sm:flex sm:items-center">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-slate-300 hover:text-white"
              >
                {link.text}
              </a>
            ))}
          </div>
        </div>

        <div className="hidden items-center gap-3 sm:flex">
          {isAdmin && (
            <Link
              href="/admin"
              className="flex items-center gap-1.5 text-sm font-medium text-slate-300 hover:text-white"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              Admin
            </Link>
          )}
          {isAuthed ? (
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: '/' })}
              className="flex h-9 items-center gap-2 rounded-full border border-white/15 px-4 text-sm font-medium text-slate-300 transition hover:border-white/25 hover:text-white"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign out
            </button>
          ) : (
            <Link
              href="/signin"
              className="flex h-9 items-center gap-2 rounded-full bg-cellulant-blue px-4 text-sm font-medium text-white transition hover:bg-cellulant-navy"
            >
              <LogIn className="h-3.5 w-3.5" />
              Sign In
            </Link>
          )}
        </div>

        <button
          type="button"
          className="block cursor-pointer text-slate-300 hover:text-white sm:hidden"
          aria-label="Menu"
          onClick={() => setMobileOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </button>

        {mobileOpen && (
          <div className="fixed inset-0 z-40 flex items-center bg-cellulant-dark">
            <button
              type="button"
              className="absolute right-6 top-6 block cursor-pointer text-slate-300 hover:text-white"
              aria-label="Close Menu"
              onClick={() => setMobileOpen(false)}
            >
              <X className="h-6 w-6" />
            </button>
            <ul className="flex w-full flex-col items-center gap-3">
              <li>
                <Link
                  href="/"
                  className="text-xl font-medium text-white hover:text-cellulant-blue"
                  onClick={() => setMobileOpen(false)}
                >
                  Home
                </Link>
              </li>
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-xl font-medium text-white hover:text-cellulant-blue"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.text}
                  </a>
                </li>
              ))}
              {isAdmin && (
                <li>
                  <Link
                    href="/admin"
                    className="text-xl font-medium text-white hover:text-cellulant-blue"
                    onClick={() => setMobileOpen(false)}
                  >
                    Admin
                  </Link>
                </li>
              )}
              <li>
                {isAuthed ? (
                  <button
                    type="button"
                    onClick={() => {
                      setMobileOpen(false);
                      signOut({ callbackUrl: '/' });
                    }}
                    className="text-xl font-medium text-cellulant-blue"
                  >
                    Sign out
                  </button>
                ) : (
                  <Link
                    href="/signin"
                    className="text-xl font-medium text-cellulant-blue"
                    onClick={() => setMobileOpen(false)}
                  >
                    Sign In
                  </Link>
                )}
              </li>
            </ul>
          </div>
        )}
      </nav>
    </div>
  );
}
