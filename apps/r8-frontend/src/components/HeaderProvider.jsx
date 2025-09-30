'use client';

import { createContext, useContext, useMemo, useState } from 'react';

const HeaderContext = createContext(undefined);

export function HeaderProvider({ children }) {
  const [state, setState] = useState({
    title: undefined,
    breadcrumbOverrides: undefined,
    userMenuItems: undefined
  });

  const value = useMemo(() => ({ state, setState }), [state]);

  return (
    <HeaderContext.Provider value={value}>{children}</HeaderContext.Provider>
  );
}

export function useHeader() {
  const ctx = useContext(HeaderContext);
  if (!ctx) throw new Error('useHeader must be used within HeaderProvider');
  return ctx;
}


