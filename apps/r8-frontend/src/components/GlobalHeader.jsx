'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { buildBreadcrumbs } from '../lib/breadcrumbs';
import LoginButton from './LoginButton';
import UserMenu from './UserMenu';
import { usePrivy } from '@privy-io/react-auth';

export default function GlobalHeader() {
  const pathname = usePathname();
  const { ready, authenticated } = usePrivy();

  const crumbs = useMemo(() => buildBreadcrumbs(pathname), [pathname]);
  const title = crumbs.length > 0 ? crumbs[crumbs.length - 1].label : 'R8-Rate';

  return (
    <header className="border-b border-gray-200">
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <Link href="/" className="text-base font-semibold tracking-tight">R8</Link>
            <div className="hidden sm:block text-gray-300">|</div>
            <div className="min-w-0">
              <div className="truncate text-sm font-medium text-gray-900">{title}</div>
              <nav className="hidden sm:flex items-center gap-1 text-xs text-gray-500">
                {crumbs.map((c, idx) => (
                  <span key={c.href} className="inline-flex items-center">
                    {idx > 0 && <span className="mx-1 text-gray-300">/</span>}
                    {idx < crumbs.length - 1 ? (
                      <Link href={c.href} className="hover:text-gray-700">{c.label}</Link>
                    ) : (
                      <span aria-current="page">{c.label}</span>
                    )}
                  </span>
                ))}
              </nav>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {ready && authenticated ? <UserMenu /> : <LoginButton />}
          </div>
        </div>
      </div>
    </header>
  );
}


