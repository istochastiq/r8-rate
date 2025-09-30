'use client';

import { usePrivy } from '@privy-io/react-auth';

function LoginWithPrivy() {
  const { ready, authenticated, login, logout } = usePrivy();
  if (!ready) return null;
  return authenticated ? (
    <button
      onClick={logout}
      className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
    >
      Log out
    </button>
  ) : (
    <button
      onClick={login}
      className="inline-flex items-center rounded-md bg-black px-3 py-1.5 text-sm font-medium text-white hover:opacity-90"
    >
      Log in
    </button>
  );
}

export default function LoginButton() {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
  if (!appId || appId === 'undefined' || appId === '') return null;
  return <LoginWithPrivy />;
}


