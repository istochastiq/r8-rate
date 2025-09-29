'use client';
import { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import Link from 'next/link';
import UserMenu from './UserMenu';

function HeaderContent() {
  return (
    <header className="border-b border-gray-200">
      <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
        <Link href="/" className="font-semibold">R8‑rate</Link>
        <nav className="flex items-center gap-4">
          <Link href="/influencers" className="text-sm text-gray-600 hover:text-gray-900">Influencers</Link>
          <UserMenu />
        </nav>
      </div>
    </header>
  );
}

let headerRoot = null;

export default function GlobalHeader() {
  useEffect(() => {
    const container = document.getElementById('app-header');
    if (container && !headerRoot) {
      headerRoot = createRoot(container);
      headerRoot.render(<HeaderContent />);
    }
    
    return () => {
      // Don't unmount on component cleanup - keep header alive
    };
  }, []);

  return null; // This component renders nothing in the React tree
}
