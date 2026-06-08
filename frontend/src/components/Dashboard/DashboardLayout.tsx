'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Dashboard/Sidebar';
import Topbar from '@/components/Dashboard/Topbar';
import Loader from '@/components/ui/Loader';
import { useAuthStore } from '@/store/useAuthStore';

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: 'ADMIN' | 'CUSTOMER';
}

export default function DashboardLayout({ children, role }: DashboardLayoutProps) {
  const router = useRouter();
  const { isAuthenticated, isHydrated } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Wait for auth initialization first
    if (!isHydrated) {
      return;
    }

    // If not authenticated after initialization, redirect
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    setIsLoading(false);
  }, [isAuthenticated, isHydrated, router]);

  useEffect(() => {
    if (!sidebarOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [sidebarOpen]);

  if (isLoading) {
    return <Loader fullPage />;
  }

  return (
    <div className='min-h-screen bg-white'>
      <div className='min-h-screen md:max-w-[1600px] md:mx-auto md:grid md:grid-cols-[280px_1fr] lg:grid lg:grid-cols-[280px_1fr]'>
        <Sidebar role={role} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className='min-w-0 w-full'>
          <Topbar role={role} onMenuToggle={() => setSidebarOpen((prev) => !prev)} />

          <main className='px-3 pb-8 pt-3 xs:px-4 sm:px-5 sm:pb-10 sm:pt-4 md:px-6 md:pb-12 md:pt-6 lg:px-8 lg:pb-14'>
            <div className='mx-auto w-full md:max-w-6xl lg:max-w-7xl min-w-0'>
              <div className='dashboard-shell'>{children}</div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
