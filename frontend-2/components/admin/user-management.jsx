"use client"


import { useAdminService } from "@/hooks/use-admin-service"
import { EnrollRevokeManagement } from "../enrollRevokeManagement";

export function UserManagement() {
 
  
  const { fetchAllUsers, enrollUser, revokeUser ,fetchUserById} = useAdminService();
  
  return (
    <EnrollRevokeManagement fetchAll={fetchAllUsers} enroll={enrollUser} revoke={revokeUser}
    
    fetchSingle={fetchUserById}
    />
  )
}
