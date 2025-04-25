'use client';

import { useEffect, useState } from 'react';

export function useSession() {
  const [session, setSession] = useState(null);
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

  const save = (data) => {
    localStorage.setItem('auth-session', JSON.stringify(data));
    document.cookie = `auth-token=${data.token}; path=/; max-age=604800`;
    setSession(data);
  };

  const clear = () => {
    localStorage.removeItem('auth-session');
    document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    setSession(null);
  };

  return { session, save, clear, loading };
}
