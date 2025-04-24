'use client';


import * as adminService from '@/lib/services/admin-services';
import { useAuth } from './use-auth';

export const useAdminService = () => {
  
  const {session } = useAuth();
  const token = session.token;

  return {
    fetchAllUsers: (verified) => adminService.fetchAllUsers(token,verified),
    fetchUserById: (userId) => adminService.fetchUserById(token, userId),
    enrollUser: (userId) => adminService.enrollUser(token, userId),
    revokeUser: (userId) => adminService.revokeUser(token, userId),
  };
};
