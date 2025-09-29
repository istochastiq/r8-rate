'use client';
import { usePrivy } from '@privy-io/react-auth';

export default function RequireAuth({ children, title = 'Sign in required' }) {
  const { ready, authenticated, login } = usePrivy();

  if (!ready) {
    return (
      <div className="rounded-lg border border-gray-200 p-6 text-sm text-gray-600">Loading…</div>
    );
  }

  if (!authenticated) {
    return (
      <div className="rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-medium mb-2">{title}</h2>
        <p className="text-sm text-gray-600 mb-4">Please sign in to view this page.</p>
        <button onClick={login} className="h-9 rounded-md bg-black px-3 text-white text-sm">Sign in</button>
      </div>
    );
  }

  return <>{children}</>;
}


