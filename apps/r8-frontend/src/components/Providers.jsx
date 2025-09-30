'use client';

import { PrivyProvider, SUPPORTED_CHAINS } from '@privy-io/react-auth';
import { HeaderProvider } from './HeaderProvider';

export default function Providers({ children }) {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
  const clientId = process.env.NEXT_PUBLIC_PRIVY_CLIENT_ID;

  // Skip PrivyProvider if appId is not defined (e.g., local dev without env var)
  if (!appId || appId === 'undefined' || appId === '') {
    return <HeaderProvider>{children}</HeaderProvider>;
  }

  const baseChain = SUPPORTED_CHAINS.find((c) => c.id === 8453);

  return (
    <PrivyProvider
      appId={appId}
      clientId={clientId}
      loginMethods={[ 'email', 'wallet', 'twitter' ]}
      config={{
        supportedChains: baseChain ? [baseChain] : undefined,
        defaultChain: baseChain
      }}
    >
      <HeaderProvider>
        {children}
      </HeaderProvider>
    </PrivyProvider>
  );
}


