'use client';

import { useEffect } from 'react';
import { useHeader } from './HeaderProvider';

export default function PageHeader({ title, breadcrumbs, userMenuItems }) {
  const { setState } = useHeader();

  useEffect(() => {
    setState((prev) => ({
      ...prev,
      title,
      breadcrumbOverrides: breadcrumbs,
      userMenuItems
    }));
    return () => {
      setState((prev) => ({ ...prev, title: undefined, breadcrumbOverrides: undefined }));
    };
  }, [title, breadcrumbs, userMenuItems, setState]);

  return null;
}


