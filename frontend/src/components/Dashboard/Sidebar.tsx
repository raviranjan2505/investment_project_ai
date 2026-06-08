'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  Clock3,
  PencilLine,
  LogOut,
  Shield,
  Star,
  Users,
  X,
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

interface SidebarProps {
  role: 'ADMIN' | 'CUSTOMER';
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ role, isOpen, onClose }) => {
  const pathname = usePathname();
  const { logout } = useAuthStore();

  const adminMenuItems = [
    { label: 'Dashboard', href: '/admin', icon: BarChart3 },
  ];

  const customerMenuItems = [
    { label: 'Overview', href: '/dashboard', icon: BarChart3 },
    { label: 'Wallet', href: '/dashboard/wallet', icon: Users },
    { label: 'Withdrawal', href: '/dashboard/withdrawal', icon: PencilLine },
    { label: 'Browse Plans', href: '/plans', icon: Star },
  ];

  const menuItems = role === 'ADMIN' ? adminMenuItems : customerMenuItems;

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm transition lg:hidden ${isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
          }`}
        onClick={onClose}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[19rem] max-w-[88vw] flex-col border-r border-white/10 bg-[linear-gradient(45deg,#1a1a1a,#03584a)] text-white shadow-2xl transition-transform duration-200 lg:sticky lg:top-0 lg:h-screen lg:w-full lg:max-w-none lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className='flex items-center justify-between border-b border-slate-200 px-5 py-5'>
          <div className='flex items-center gap-3'>
            <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white'>
              <Shield size={18} />
            </div>
            <div>
              <h1 className='text-base font-semibold text-slate-300'>{role === 'ADMIN' ? 'Admin Console' : 'My Account'}</h1>
              <p className='text-xs uppercase tracking-[0.18em] text-slate-100'>{role} portal</p>
            </div>
          </div>

          <button
            type='button'
            onClick={onClose}
            className='rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 lg:hidden'
            aria-label='Close navigation'
          >
            <X size={18} />
          </button>
        </div>

        <div className='px-5 pt-5'>
          <div className='rounded-2xl border border-slate-200 bg-slate-50 p-4'>
            <p className='text-xs font-semibold uppercase tracking-[0.18em] text-slate-500'>Workspace</p>
            <p className='mt-2 text-sm leading-6 text-slate-600'>
              {role === 'ADMIN'
                ? 'Manage platform operations and user accounts.'
                : 'Manage your investments, wallet, and withdrawals.'}
            </p>
          </div>
        </div>

        <nav className='flex-1 space-y-1 overflow-y-auto px-4 py-6'>
          <p className='px-3 pb-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-100'>Navigation</p>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-[1.4rem] border px-4 py-4 transition ${
                  isActive
                    ? 'border-amber-300/30 bg-amber-300/10 text-white'
                    : 'border-white/8 bg-white/[0.03] text-slate-300 hover:border-white/14 hover:bg-white/[0.06] hover:text-white'
                }`}
                onClick={onClose}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl ${
                      isActive ? 'bg-amber-300 text-slate-950' : 'bg-white/8 text-slate-200'
                    }`}
                  >
                    <Icon size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium">{item.label}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className='border-t border-slate-200 p-4'>
          <button
            onClick={() => {
              logout();
              window.location.href = '/login';
            }}
            className='flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-rose-600 transition hover:bg-rose-50'
          >
            <span className='flex h-9 w-9 items-center justify-center rounded-lg bg-rose-50'>
              <LogOut size={18} />
            </span>
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
