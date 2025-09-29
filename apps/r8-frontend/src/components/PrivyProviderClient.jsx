'use client';
import { usePrivy } from '@privy-io/react-auth';
import { useEffect, useState } from 'react';
import { formatEther } from 'viem';

// Providers moved to AppProviders to keep a single stable provider tree

export function SignInButton() {
  const { ready, authenticated, login, logout, user } = usePrivy();
  const container = 'min-w-[240px] flex justify-end';
  const [balance, setBalance] = useState(null);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  useEffect(() => {
    async function fetchBalance() {
      try {
        if (!authenticated) return;
        const addr = user?.wallet?.address || user?.linkedAccounts?.find(a => a.type === 'wallet')?.address;
        if (!addr || !window?.ethereum) return;
        const res = await window.ethereum.request({ method: 'eth_getBalance', params: [addr, 'latest'] });
        if (res) setBalance(formatEther(BigInt(res)));
      } catch {}
    }
    fetchBalance();
  }, [authenticated, user]);

  // Remember last stable UI to avoid flicker during route transitions
  // fetch balance after auth
  useEffect(() => {
    async function fetchBalance() {
      try {
        if (!hydrated || !authenticated) return;
        const addr = user?.wallet?.address || user?.linkedAccounts?.find(a => a.type === 'wallet')?.address;
        if (!addr || !window?.ethereum) return;
        const res = await window.ethereum.request({ method: 'eth_getBalance', params: [addr, 'latest'] });
        if (res) setBalance(formatEther(BigInt(res)));
      } catch {}
    }
    fetchBalance();
  }, [hydrated, authenticated, user]);

  const isAuthed = hydrated && authenticated;
  const uiBalance = balance;

  const handleLogout = async () => {
    try { await logout(); } finally { setPrevState((p) => ({ ...p, authenticated: false })); }
  };
  // Until hydrated or not authenticated: show stable Sign in button (no dropdown)
  if (!hydrated || !isAuthed) {
    return (
      <div className={container}>
        <button onClick={login} className="h-9 rounded-md bg-black px-3 text-white text-sm">Sign in</button>
      </div>
    );
  }

  // Render a stable menu structure for both states to avoid hydration flicker
  return (
    <div className={container}>
      <div className="relative">
        <details className="group">
          <summary className="h-9 rounded-md bg-gray-900 text-white px-3 text-sm cursor-pointer list-none flex items-center gap-2">
            <span className="hidden sm:inline">Menu</span>
            {uiBalance && (
              <span className="text-xs bg-gray-800 px-2 py-0.5 rounded">{Number(uiBalance).toFixed(4)} ETH</span>
            )}
          </summary>
          <div className="absolute right-0 mt-2 w-56 rounded-md border bg-white shadow-lg z-50">
            <nav className="py-1 text-sm">
              <a href="/account/positions" className="block px-3 py-2 hover:bg-gray-50">My positions</a>
              <a href="/threads" className="block px-3 py-2 hover:bg-gray-50">Threads</a>
              <a href="/influencers" className="block px-3 py-2 hover:bg-gray-50">Influencers</a>
              <div className="border-t my-1" />
              <button onClick={() => window?.privy?.fundWallet?.()} className="block w-full text-left px-3 py-2 hover:bg-gray-50">Deposit</button>
              <button onClick={() => window?.privy?.withdrawFunds?.()} className="block w-full text-left px-3 py-2 hover:bg-gray-50">Withdraw</button>
              <div className="border-t my-1" />
              <button onClick={handleLogout} className="block w-full text-left px-3 py-2 hover:bg-gray-50 text-red-600">Sign out</button>
            </nav>
          </div>
        </details>
      </div>
    </div>
  );
}


