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
    setSession(data);
  };

  const clear = () => {
    localStorage.removeItem('auth-session');
    setSession(null);
  };

  return { session, save, clear, loading };
}
