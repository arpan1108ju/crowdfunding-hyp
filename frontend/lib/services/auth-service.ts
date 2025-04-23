// auth/auth-service.ts

export type AuthCredentials = {
    email: string;
    password: string;
};
  
interface X509Identity {
    type: string;
    mspId: string;
    credentials: {
      certificate: string;
      private_key: string;
    };
}
  
  export type UserSession = {
    userId: string;
    username: string;
    email: string;
    token: string;
    role: string;
    isVerified: boolean;
    x509identity: X509Identity;
  };
  
  const API_BASE_URL = 'http://localhost:3000/api/v1/auth';
  
  export const login = async (credentials: AuthCredentials): Promise<UserSession> => {
    const res = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
  
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Login failed');
    }
  
    return await res.json(); // Return session, let client store it
  };
  
  export const signup = async (credentials: AuthCredentials): Promise<UserSession> => {
    const res = await fetch(`${API_BASE_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
  
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Signup failed');
    }
  
    return await res.json(); // Return session, let client store it
  };
  