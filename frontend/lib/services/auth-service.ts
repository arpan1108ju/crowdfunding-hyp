// auth/auth-service.ts

export type AuthCredentials = {
    email: string;
    password: string;
    username?: string;
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
    username?: string;
    email?: string;
    token?: string;
    role?: string;
    isVerified?: boolean;
    x509identity?: X509Identity;
  };


  interface User {
    username: string;
    email: string;
    role: string;
    isVerified: boolean;
    x509identity?: X509Identity;
  }

  interface Data { 
    user : User;
    token : string;
  } 

  export type AuthResponse = {
     success : boolean;
     message : string;
     data : Data;
  }


  export type Message = {
     success : boolean;
     message : string;
  }
  
  const API_BASE_URL = 'http://localhost:5000/api/v1/auth';
  
  export const login = async (credentials: AuthCredentials): Promise<AuthResponse | Message> => {
    try {
      const res = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if(res.status !== 200){
         const err : Message = await res.json();
         return err;
      }
      const response : AuthResponse = await res.json();
      return response;
    } catch (error) {
      return {
        success: false,
        message: 'Network error or invalid server response'
      };
    }
  };
  
  export const signup = async (credentials: AuthCredentials): Promise<AuthResponse | Message> => {
    try {
      const res = await fetch(`${API_BASE_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
  
      if(res.status !== 200){
        const err : Message = await res.json();
        return err;
     }

      const response : AuthResponse = await res.json();
      return response;
    } catch (error) {
      return {
        success: false,
        message: 'Network error or invalid server response'
      };
    }
  };

  