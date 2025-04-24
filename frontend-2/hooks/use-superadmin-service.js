'use client';

import { useAuth } from '@/hooks/use-auth';
import { fetchAllUsers, fetchUserById } from '@/lib/services/admin-services';
import * as superadminService from '@/lib/services/super-admin-services';

export const useSuperadminService = () => {
  const {session } = useAuth();
  const token = session.token;


  return {
    fetchAllUsers: () => fetchAllUsers(token),
    fetchUserById: (userId) => fetchUserById(token, userId),
    enrollSuperadmin: () => superadminService.enrollSuperadmin(token),
    changeUserRole: (userId, role) => superadminService.changeUserRole(token, userId, role),
    enrollAdmin: (adminId) => superadminService.enrollAdmin(token, adminId),
    revokeAdmin: (adminId) => superadminService.revokeAdmin(token, adminId),
  };
};
