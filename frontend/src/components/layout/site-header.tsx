'use client';

import type { ReactElement } from 'react';
import { useState } from 'react';
import { Menu, X, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import { APP_NAME } from '@/lib/constants';
import { HeaderAuthActions } from '@/components/layout/header-auth-actions';

export function SiteHeader(): ReactElement {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full">

  {/* FIXED SOLID BACKGROUND (no scroll change) */}
  <div className="bg-slate-950 border-b border-white/10 shadow-lg">

    <div className="px-4 md:px-8 py-4">

      <div className="max-w-7xl mx-auto flex items-center justify-between">

        {/* LOGO */}
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-xl md:text-2xl text-white"
        >
          <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>

          <span className="tracking-wide  text-white">{APP_NAME}</span>
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-blue-100">

          <Link href="/plans" className="hover:text-white transition">
            Plans
          </Link>

          <Link href="/dashboard" className="hover:text-white transition">
            Dashboard
          </Link>

          <Link href="/#features" className="hover:text-white transition">
            Features
          </Link>

        </nav>

        {/* AUTH */}
        <div className="hidden md:block">
          <HeaderAuthActions />
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 rounded-lg bg-white/5 border border-white/10"
        >
          {isMenuOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <Menu className="w-6 h-6 text-white" />
          )}
        </button>

      </div>

      {/* MOBILE MENU */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-white/10">

          <nav className="flex flex-col gap-4 text-blue-100">
            <Link href="/plans" onClick={() => setIsMenuOpen(false)}>Plans</Link>
            <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
            <Link href="/#features" onClick={() => setIsMenuOpen(false)}>Features</Link>
          </nav>

          <div className="mt-4 pt-4 border-t border-white/10">
            <HeaderAuthActions />
          </div>

        </div>
      )}

    </div>
  </div>
</header>
  );
}