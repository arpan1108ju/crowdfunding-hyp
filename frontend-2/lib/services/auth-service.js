
  const API_URL = `${env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth`;
  
  export const login = async (credentials) => {
    try {
      const res = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if(res.status !== 200){
         const err = await res.json();
         return err;
      }
      const response  = await res.json();
      return response;
    } catch (error) {
      return {
        success: false,
        message: 'Network error or invalid server response'
      };
    }
  };
  
  export const signup = async (credentials) => {
    try {
      const res = await fetch(`${API_BASE_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
  
      if(res.status !== 200){
        const err = await res.json();
        return err;
     }

      const response  = await res.json();
      return response;
    } catch (error) {
      return {
        success: false,
        message: 'Network error or invalid server response'
      };
    }
  };

  