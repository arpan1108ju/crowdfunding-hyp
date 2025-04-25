'use client';

import { fetchAllUsers, fetchUserById } from '@/lib/services/admin-services';
import {
  enrollSuperadmin,
  changeUserRole,
  enrollAdmin,
  revokeAdmin
} from '@/lib/services/super-admin-services';

export const useSuperadminService = () => ({
  fetchAllUsers,
  fetchUserById,
  enrollSuperadmin,
  changeUserRole,
  enrollAdmin,
  revokeAdmin,
});
