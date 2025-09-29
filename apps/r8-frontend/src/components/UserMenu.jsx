'use client';
import { usePrivy } from '@privy-io/react-auth';

export default function UserMenu() {
  const { ready, authenticated, login, logout } = usePrivy();

  // Show nothing until Privy is ready to avoid hydration mismatches
  if (!ready) {
    return <div className="w-20 h-9" />; // Placeholder with fixed width
  }

  if (authenticated) {
    return (
      <div className="relative">
        <details className="group">
          <summary className="h-9 rounded-md bg-gray-900 text-white px-3 text-sm cursor-pointer list-none flex items-center gap-2">
            Menu
          </summary>
          <div className="absolute right-0 mt-2 w-56 rounded-md border bg-white shadow-lg z-50">
            <nav className="py-1 text-sm">
              <a href="/account/positions" className="block px-3 py-2 hover:bg-gray-50">My positions</a>
              <a href="/threads" className="block px-3 py-2 hover:bg-gray-50">Threads</a>
              <a href="/influencers" className="block px-3 py-2 hover:bg-gray-50">Influencers</a>
              <div className="border-t my-1" />
              <button onClick={() => alert('Deposit')} className="block w-full text-left px-3 py-2 hover:bg-gray-50">
                Deposit
              </button>
              <button onClick={() => alert('Withdraw')} className="block w-full text-left px-3 py-2 hover:bg-gray-50">
                Withdraw
              </button>
              <div className="border-t my-1" />
              <button onClick={logout} className="block w-full text-left px-3 py-2 hover:bg-gray-50 text-red-600">
                Sign out
              </button>
            </nav>
          </div>
        </details>
      </div>
    );
  }

  return (
    <button onClick={login} className="h-9 rounded-md bg-black px-3 text-white text-sm">
      Sign in
    </button>
  );
}