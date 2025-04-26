'use client';

import React, { createContext, useContext } from 'react';
import { useSession } from '@/hooks/use-session'; // adjust import based on where your hook is
import * as AuthService from '@/lib/services/auth-service';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const { session, save, clear, loading } = useSession();

  const checkAndSendResponse = (response) => {
    if (response.success && 'data' in response) {
      const authResponse = response;
      save({
        username: authResponse.data.user.username,
        email: authResponse.data.user.email,
        isVerified: authResponse.data.user.isVerified,
        x509Identity: authResponse.data.user.x509Identity,
        role: authResponse.data.user.role,
      });
      return response;
    }

    return response;
  };

  const login = async (creds) => {
    const response = await AuthService.login(creds);
    return checkAndSendResponse(response);
  };

  const signup = async (creds) => {
    const response = await AuthService.signup(creds);
    return checkAndSendResponse(response);
  };

  const logout = async () => {
    const response = await AuthService.logout();
    clear();
    return response;
  };

  const value = {
    session,
    login,
    signup,
    logout,
    loading,
    save,
    clear,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  return useContext(AuthContext);
}
