'use client';
import UserMenu from './UserMenu';
import Link from 'next/link';

export default function ClientHeader() {
  return (
    <>
      <header className="border-b border-gray-200">
        <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
          <Link href="/" className="font-semibold">R8‑rate</Link>
          <nav className="flex items-center gap-4">
            <Link href="/influencers" className="text-sm text-gray-600 hover:text-gray-900">Influencers</Link>
            <UserMenu />
          </nav>
        </div>
      </header>
    </>
  );
}


