'use client';

import { useCallback, useEffect, useState } from 'react';
import { apiRequest } from '@/lib/api/client';

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role?: 'user' | 'admin';
}

interface AuthPayload {
  token: string;
  user: AuthUser;
}

const AUTH_TOKEN_KEY = 'investmentToken';
const AUTH_USER_KEY = 'investmentUser';

/* -------------------- helpers -------------------- */

function getStoredUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;

  const data = localStorage.getItem(AUTH_USER_KEY);
  if (!data) return null;

  try {
    return JSON.parse(data);
  } catch {
    localStorage.removeItem(AUTH_USER_KEY);
    localStorage.removeItem(AUTH_TOKEN_KEY);
    return null;
  }
}

function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

function saveAuth(user: AuthUser, token: string) {
  if (typeof window === 'undefined') return;

  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

function clearAuth() {
  if (typeof window === 'undefined') return;

  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
}

/* -------------------- store -------------------- */

export function useAuthStore() {
  const [user, setUser] = useState<AuthUser | null>(() => getStoredUser());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!getStoredToken() && !!getStoredUser();
  });
  const [isHydrated, setIsHydrated] = useState(false);

  /* -------------------- init -------------------- */
  useEffect(() => {
    const storedUser = getStoredUser();
    const storedToken = getStoredToken();

    if (storedUser && storedToken) {
      setUser(storedUser);
      setIsAuthenticated(true);
    } else {
      setUser(null);
      setIsAuthenticated(false);
    }

    setIsHydrated(true);
  }, []);

  /* -------------------- auth actions -------------------- */

  const login = useCallback(async (email: string, password: string) => {
    const result = await apiRequest<AuthPayload>('/auth/login', {
      method: 'POST',
      body: {
        email: email.trim().toLowerCase(),
        password,
      },
    });

    saveAuth(result.user, result.token);
    setUser(result.user);
    setIsAuthenticated(true);

    return result.user;
  }, []);

  const register = useCallback(async (
    name: string,
    email: string,
    password: string,
    referralCode?: string
  ) => {
    const result = await apiRequest<AuthPayload>('/auth/register', {
      method: 'POST',
      body: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        ...(referralCode ? { referralCode } : {}),
      },
    });

    saveAuth(result.user, result.token);
    setUser(result.user);
    setIsAuthenticated(true);

    return result.user;
  }, []);

  const logout = useCallback(() => {
    clearAuth();
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const updateProfile = useCallback((updates: Pick<AuthUser, 'name' | 'email'>) => {
    setUser((prev) => {
      if (!prev) return prev;

      const updated: AuthUser = {
        ...prev,
        name: updates.name.trim(),
        email: updates.email.trim().toLowerCase(),
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(updated));
      }

      return updated;
    });
  }, []);

  const getUserRole = useCallback(() => {
    return user?.role || 'user';
  }, [user]);

  const getToken = useCallback(() => {
    return getStoredToken();
  }, []);

  return {
    user,
    isAuthenticated,
    isHydrated,

    login,
    register,
    logout,
    updateProfile,

    getUserRole,
    getToken,
  };
}