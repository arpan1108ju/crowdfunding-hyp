'use client';

import { useAuth } from '@/hooks/useAuth';
import * as adminService from '@/services/adminService';

export const useAdminService = () => {
  const { token } = useAuth();

  return {
    fetchAllUsers: () => adminService.fetchAllUsers(token),
    fetchUserById: (userId) => adminService.fetchUserById(token, userId),
    enrollUser: (userId) => adminService.enrollUser(token, userId),
    revokeUser: (userId) => adminService.revokeUser(token, userId),
  };
};
