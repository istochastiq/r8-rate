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
  const container = 'w-[110px] flex justify-end';
  if (!ready) {
    return (
      <div className={container}>
        <div className="h-9 w-[92px] rounded-md bg-gray-200 animate-pulse" />
      </div>
    );
  }
  if (authenticated) {
    return (
      <div className={container}>
        <button onClick={logout} className="h-9 rounded-md bg-gray-200 px-3 text-sm">Sign out</button>
      </div>
    );
  }
  return (
    <div className={container}>
      <button onClick={login} className="h-9 rounded-md bg-black px-3 text-white text-sm">Sign in</button>
    </div>
  );
}


