'use client';
import { PrivyProvider } from '@privy-io/react-auth';

export default function AppProviders({ children }) {
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


