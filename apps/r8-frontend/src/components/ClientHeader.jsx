'use client';
import { Providers, SignInButton } from './PrivyProviderClient';

export default function ClientHeader() {
  return (
    <Providers>
      <header className="border-b border-gray-200">
        <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
          <a href="/" className="font-semibold">R8‑rate</a>
          <nav className="flex items-center gap-4">
            <a href="/influencers" className="text-sm text-gray-600 hover:text-gray-900">Influencers</a>
            <SignInButton />
          </nav>
        </div>
      </header>
    </Providers>
  );
}


