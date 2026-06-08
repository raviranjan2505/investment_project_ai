'use client';

import type { ReactElement, ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/Dashboard/DashboardLayout';
import { useAuthStore } from '@/store/useAuthStore';
import Loader from '@/components/ui/Loader';

interface Props {
  children: ReactNode;
}

export default function DashboardLayoutWrapper({
  children,
}: Props): ReactElement {
  const router = useRouter();

  const {
    user,
    isAuthenticated,
    isHydrated,
    getUserRole,
  } = useAuthStore();

  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!isHydrated) return;

    if (!isAuthenticated || !user) {
      router.replace('/login');
      return;
    }

    const role = getUserRole();

    if (role === 'admin') {
      router.replace('/admin');
      return;
    }

    setChecking(false);
  }, [isHydrated, isAuthenticated, user, getUserRole, router]);

  if (!isHydrated || checking) {
    return <Loader fullPage />;
  }

  return (
    <DashboardLayout role="CUSTOMER">
      {children}
    </DashboardLayout>
  );
}