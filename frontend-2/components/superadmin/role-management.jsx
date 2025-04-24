"use client"

import { useEffect, useState } from "react"
import { User, Shield, UserCog } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { isValidRole } from "@/lib/constants"
import { toast } from "sonner"
import { useSuperadminService } from "@/hooks/use-superadmin-service"

export function RoleManagement({session}) {

  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { changeUserRole,fetchAllUsers,fetchUserById } = useSuperadminService();


  useEffect(() => {
     
    

  },[session]);


  // Mock data - would come from API in real app
  // const [users, setUsers] = useState([
  //   { id: "1", email: "user1@example.com", role: "user" },
  //   { id: "2", email: "user2@example.com", role: "user" },
  //   { id: "3", email: "admin1@example.com", role: "admin" },
  //   { id: "4", email: "admin2@example.com", role: "admin" },
  //   { id: "5", email: "superadmin@example.com", role: "superadmin" },
  // ])


  const filteredUsers = users.filter((user) => user.email.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleRoleChange = (userId, newRole) => {
    if (!isValidRole(newRole)) {
      toast.error("Invalid Role", {
        description: `Role must be one of: ${Object.values(ROLE).join(", ")}`
      });
      return;
    }

    try {
      setUsers(
        users.map((user) => {
          if (user.id === userId) {
            return {
              ...user,
              role: newRole,
            }
          }
          return user
        }),
      )

      toast.success("Success", {
        description: "User role has been updated"
      })
    } catch (error) {
      toast.error("Error", {
        description: error.message || "Failed to update user role"
      });
    }
  }


  

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Current Role</TableHead>
              <TableHead>Change Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {user.role === "superadmin" ? (
                        <UserCog className="mr-2 h-4 w-4 text-purple-500" />
                      ) : user.role === "admin" ? (
                        <Shield className="mr-2 h-4 w-4 text-blue-500" />
                      ) : (
                        <User className="mr-2 h-4 w-4 text-gray-500" />
                      )}
                      <span className="capitalize">{user.role}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Select
                      defaultValue={user.role}
                      onValueChange={(value) => handleRoleChange(user.id, value)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="superadmin">Super Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
