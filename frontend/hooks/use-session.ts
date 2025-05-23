'use client';

import { useEffect, useState } from 'react';
import type { UserSession } from '@/lib/services/auth-service';

export function useSession() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    const raw = localStorage.getItem('auth-session');
    try {
      setSession(raw ? JSON.parse(raw) : null);
    } catch {
      setSession(null);
    } finally {
        setLoading(false);
    }
  }, []);

  const save = (data: UserSession) => {
    localStorage.setItem('auth-session', JSON.stringify(data));
    setSession(data);
  };

  const clear = () => {
    localStorage.removeItem('auth-session');
    setSession(null);
  };

  return { session, save, clear, loading };
}
