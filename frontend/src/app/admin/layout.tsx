'use client';

import type { ReactNode } from 'react';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/Dashboard/DashboardLayout';
import { useAuthStore } from '@/store/useAuthStore';
import Loader from '@/components/ui/Loader';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayoutWrapper({
  children,
}: AdminLayoutProps): ReactNode {
  const router = useRouter();
  const { isAuthenticated, user, getUserRole } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const verifyCalledRef = useRef(false);

  useEffect(() => {
    // Prevent running verify twice in strict mode
    if (verifyCalledRef.current) {
      return;
    }
    verifyCalledRef.current = true;

    const verifyAuth = async () => {
      // Check if user is already loaded from storage
      if (!isAuthenticated || !user) {
        router.push('/login');
        return;
      }

      const role = getUserRole();
      
      // Redirect non-admin users to user dashboard
      if (role !== 'admin') {
        router.push('/dashboard');
        return;
      }

      setIsLoading(false);
    };

    verifyAuth();
  }, []); // Empty dependency array - run only once on mount

  if (isLoading) {
    return <Loader fullPage />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <DashboardLayout role="ADMIN">
      {children}
    </DashboardLayout>
  );
}
