"use client"

import { useSuperadminService } from "@/hooks/use-superadmin-service"
import { EnrollRevokeManagement } from "../enrollRevokeManagement";

export function AdminManagement() {

  const { fetchAllUsers, enrollAdmin, revokeAdmin,fetchUserById , changeUserRole } = useSuperadminService();
  
  return (
    <EnrollRevokeManagement fetchAll={fetchAllUsers} enroll={enrollAdmin} revoke={revokeAdmin}
      
      fetchSingle={fetchUserById}
      isCallerSuperAdmin={true}
      changeRole={changeUserRole}
    />
  )
}