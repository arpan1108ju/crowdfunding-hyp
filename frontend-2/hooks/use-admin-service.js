'use client';

import { useAuth } from '@/hooks/use-auth';
import * as adminService from '@/lib/services/admin-services';

export const useAdminService = () => {
  const { token } = useAuth();

  return {
    fetchAllUsers: () => adminService.fetchAllUsers(token),
    fetchUserById: (userId) => adminService.fetchUserById(token, userId),
    enrollUser: (userId) => adminService.enrollUser(token, userId),
    revokeUser: (userId) => adminService.revokeUser(token, userId),
  };
};
