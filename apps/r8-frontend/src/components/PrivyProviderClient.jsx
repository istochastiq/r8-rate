'use client';
import { PrivyProvider, usePrivy } from '@privy-io/react-auth';

export function Providers({ children }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID}
      config={{
        appearance: { accentColor: '#000000' },
        embeddedWallets: { createOnLogin: 'users-without-wallets' }
      }}
    >
      {children}
    </PrivyProvider>
  );
}

export function SignInButton() {
  const { ready, authenticated, login, logout } = usePrivy();
  if (!ready) return null;
  if (authenticated) {
    return (
      <button onClick={logout} className="rounded-md bg-gray-200 px-3 py-2 text-sm">Sign out</button>
    );
  }
  return (
    <button onClick={login} className="rounded-md bg-black px-3 py-2 text-white text-sm">Sign in</button>
  );
}


