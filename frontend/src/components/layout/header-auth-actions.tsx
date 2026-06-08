'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { LogOut, User } from 'lucide-react';

export function HeaderAuthActions() {
  const router = useRouter();
  const { isAuthenticated, user, logout, isHydrated } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  // Prevent hydration mismatch by not rendering until store is hydrated
  if (!isHydrated) {
    return (
      <div className="flex items-center gap-3">
        <Link
          href="/login"
          className="px-4 py-2 text-white hover:text-blue-100 transition font-medium"
        >
          Login
        </Link>
        <Link
          href="/signup"
          className="px-4 py-2 bg-blue-400 text-blue-900 font-semibold rounded-lg hover:bg-blue-300 transition"
        >
          Sign Up
        </Link>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-3">
        <Link
  href="/login" className="px-4 py-2 !text-white hover:!text-blue-100 transition font-medium"
>
  Login
</Link>
        <Link
          href="/signup"
          className="px-4 py-2 bg-blue-400 text-blue-900 font-semibold rounded-lg hover:bg-blue-300 transition"
        >
          Sign Up
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <div className="hidden md:flex items-center gap-2 text-blue-100">
        <User className="w-4 h-4" />
        <span>{user?.name}</span>
      </div>
      <button
        onClick={() => router.push('/dashboard')}
        className="px-4 py-2 bg-blue-400 text-blue-900 font-semibold rounded-lg hover:bg-blue-300 transition hidden md:block"
      >
        Dashboard
      </button>
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 px-4 py-2 text-blue-100 hover:text-white transition"
      >
        <LogOut className="w-4 h-4" />
        Logout
      </button>
    </div>
  );
}
