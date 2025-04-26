'use client';

import { useSession } from './use-session';
import * as AuthService from '@/lib/services/auth-service';
import type { AuthCredentials, AuthResponse, Message } from '@/lib/services/auth-service';

export function useAuth() {
  const { session, save, clear, loading } = useSession();
  

  const login = async (creds: AuthCredentials) => {
    const response = await AuthService.login(creds);
    
    if (response.success && 'data' in response) {
      // This is an AuthResponse with successful login
      const authResponse = response as AuthResponse;
      save({ 
        username : authResponse.data.user.username,
        email : authResponse.data.user.email,
        isVerified : authResponse.data.user.isVerified,
        x509identity : authResponse.data.user.x509identity,
        role : authResponse.data.user.role,
        token : authResponse.data.token
      });
      return response;
    }
    
    // This is a Message (error case)
    return response;
  };

  const signup = async (creds: AuthCredentials) => {
    const response = await AuthService.signup(creds);
    
    if (response.success && 'data' in response) {
      // This is an AuthResponse with successful signup
      const authResponse = response as AuthResponse;
      save({ 
        username : authResponse.data.user.username,
        email : authResponse.data.user.email,
        isVerified : authResponse.data.user.isVerified,
        x509identity : authResponse.data.user.x509identity,
        role : authResponse.data.user.role,
        token : authResponse.data.token
      });
      return response;
    }
    
    // This is a Message (error case)
    return response;
  };

  const logout = async () => {
    clear();
  };

  return { session, login, signup, logout, loading };
}
