'use client';

import { useSession } from './use-session';
import * as AuthService from '@/lib/services/auth-service';

export function useAuth() {
  const { session, save, clear, loading } = useSession();
  
  const checkAndSendResponse = (response) => {
    if (response.success && 'data' in response) {
      // This is an AuthResponse with successful login
      const authResponse = response;
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
  }


  const login = async (creds) => {
    const response = await AuthService.login(creds);
    return checkAndSendResponse(response);
   
  };

  const signup = async (creds) => {
    const response = await AuthService.signup(creds);
    return checkAndSendResponse(response);
    
  };

  const logout = async () => {
    clear();
  };

  return { session, login, signup, logout, loading };
}
