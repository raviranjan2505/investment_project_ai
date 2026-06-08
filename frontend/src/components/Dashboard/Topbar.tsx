'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, ChevronDown, Menu, Search, User } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

interface TopbarProps {
  role: 'ADMIN' | 'CUSTOMER';
  onMenuToggle: () => void;
}

const pageTitles: Record<string, string> = {
  '/admin': 'Admin Dashboard',
  '/admin/users': 'Users',
  '/admin/bookings': 'Bookings',
  '/admin/commissions': 'Commissions',
  '/dashboard': 'Investment Dashboard',
  '/dashboard/wallet': 'Wallet',
  '/dashboard/withdrawal': 'Withdrawal',
  '/plans': 'Browse Plans',
  '/invest': 'Make Investment',
};

const Topbar: React.FC<TopbarProps> = ({ role, onMenuToggle }) => {
  const pathname = usePathname();
  const [showMenu, setShowMenu] = useState(false);
  const { user, logout } = useAuthStore();

  const title = useMemo(() => {
    if (pageTitles[pathname]) return pageTitles[pathname];
    if (pathname.startsWith('/admin') && pathname.includes('/edit')) return 'Edit Listing';
    return role === 'ADMIN' ? 'Admin Dashboard' : 'Customer Dashboard';
  }, [pathname, role]);

  return (
    <header className='sticky top-0 z-20 border-b border-transparent bg-transparent px-2 xs:px-3 sm:px-4 md:px-6 lg:px-8 pt-2 xs:pt-3 sm:pt-4'>
      <div className='flex items-center justify-between gap-2 xs:gap-3 rounded-xl md:rounded-2xl border border-white/70 bg-white/85 px-3 xs:px-4 sm:px-5 md:px-6 py-2 xs:py-2.5 sm:py-3 shadow-[0_14px_40px_-28px_rgba(15,23,42,0.22)] backdrop-blur'>
        <div className='flex min-w-0 items-center gap-2 xs:gap-3'>
          <button
            type='button'
            onClick={onMenuToggle}
            className='inline-flex h-9 xs:h-10 w-9 xs:w-10 items-center justify-center rounded-lg xs:rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 md:hidden'
            aria-label='Open navigation'
          >
            <Menu size={16} />
          </button>

          <div className='min-w-0'>
            <p className='text-xs font-semibold uppercase tracking-[0.16em] text-slate-500'>{role}</p>
            <h2 className='truncate text-base xs:text-lg sm:text-xl md:text-2xl font-semibold text-slate-900'>{title}</h2>
          </div>
        </div>

        <div className='flex items-center gap-1 xs:gap-2 sm:gap-3'>
          <div className='hidden items-center gap-2 rounded-lg xs:rounded-xl border border-slate-200 bg-slate-50 px-2 xs:px-3 py-1.5 xs:py-2 text-slate-500 md:flex'>
            <Search size={14} />
            <span className='text-xs xs:text-sm'>Search disabled</span>
          </div>

          <button className='relative inline-flex h-9 xs:h-10 w-9 xs:w-10 items-center justify-center rounded-lg xs:rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50'>
            <Bell size={16} />
            <span className='absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-rose-500' />
          </button>

          <div className='relative'>
            <button
              onClick={() => setShowMenu((prev) => !prev)}
              className='flex items-center gap-2 xs:gap-3 rounded-lg xs:rounded-xl border border-slate-200 bg-white px-1.5 xs:px-2 sm:px-3 py-1.5 xs:py-2'
            >
              <div className='flex h-8 xs:h-9 w-8 xs:w-9 items-center justify-center rounded-lg bg-slate-900 text-white'>
                <User size={14} />
              </div>
              <div className='hidden min-w-0 text-left sm:block'>
                <p className='truncate text-xs xs:text-sm font-semibold text-slate-900'>{user?.name || `${role} user`}</p>
                <p className='truncate text-xs text-slate-500'>{user?.email}</p>
              </div>
              <ChevronDown size={14} className='hidden text-slate-500 sm:block' />
            </button>

            {showMenu && (
              <div className='absolute right-0 mt-2 xs:mt-3 w-56 xs:w-64 overflow-hidden rounded-xl md:rounded-2xl border border-slate-200 bg-white shadow-xl'>
                <div className='border-b border-slate-100 bg-slate-50 px-3 xs:px-4 py-3 xs:py-4'>
                  <p className='truncate text-xs xs:text-sm font-semibold text-slate-900'>{user?.name}</p>
                  <p className='truncate text-xs text-slate-500 mt-1'>{user?.email}</p>
                </div>
                <div className='p-1.5 xs:p-2'>
                  {role === 'CUSTOMER' ? (
                    <>
                      <Link
                        href='/dashboard/wallet'
                        className='block w-full rounded-lg xs:rounded-xl px-2 xs:px-3 py-2 xs:py-2.5 text-left text-xs xs:text-sm text-slate-700 transition hover:bg-slate-50'
                        onClick={() => setShowMenu(false)}
                      >
                        View Wallet
                      </Link>
                      <Link
                        href='/plans'
                        className='block w-full rounded-lg xs:rounded-xl px-2 xs:px-3 py-2 xs:py-2.5 text-left text-xs xs:text-sm text-slate-700 transition hover:bg-slate-50'
                        onClick={() => setShowMenu(false)}
                      >
                        Browse Plans
                      </Link>
                    </>
                  ) : null}
                  <button
                    className='w-full rounded-lg xs:rounded-xl px-2 xs:px-3 py-2 xs:py-2.5 text-left text-xs xs:text-sm text-rose-600 transition hover:bg-rose-50'
                    onClick={() => {
                      logout();
                      window.location.href = '/login';
                    }}
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
