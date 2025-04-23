'use client';

import { useSession } from './use-session';
import * as AuthService from '@/lib/services/auth-service';
import type { AuthCredentials } from '@/lib/services/auth-service';

export function useAuth() {
  const { session, save, clear,loading } = useSession();
  

  const login = async (creds: AuthCredentials) => {
    const user = await AuthService.login(creds);
    save(user);
    return user;
  };

  const signup = async (creds: AuthCredentials) => {
    const user = await AuthService.signup(creds);
    save(user);
    return user;
  };

  const logout = async () => {
    clear();
  };

  return { session, login, signup, logout,loading };
}
