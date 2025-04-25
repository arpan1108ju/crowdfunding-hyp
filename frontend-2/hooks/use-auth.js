'use client';

import { useAuthContext } from '@/context/auth-context';

export function useAuth() {
  
  const {
    session,
    login,
    signup,
    logout,
    loading, } = useAuthContext();

  return { session, login, signup, logout, loading };
}
