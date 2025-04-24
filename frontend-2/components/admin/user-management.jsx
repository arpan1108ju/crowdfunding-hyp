"use client"

import { useEffect, useState } from "react"
import { Check, X, Shield, User, RefreshCcw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { toast } from "sonner"
import { useAdminService } from "@/hooks/use-admin-service"
import { ROLE } from "@/lib/constants"
import { UserManagementSkeleton } from "./loading-skeleton"

export function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUser, setSelectedUser] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  
  const { fetchAllUsers, enrollUser, revokeUser } = useAdminService();
  
  const [users, setUsers] = useState([]);

  const getUsers = async () => {
    setIsLoading(true)
    try {
      const result = await fetchAllUsers();
      if(!result.success){
        throw new Error(result.message);
      }
      setUsers(result.data);
    } catch (error) {
      toast.error("Error", {
        description: error.message || "Failed to fetch users"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefresh = () => {
    getUsers()
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === "all" || user.role.toLowerCase() === roleFilter
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "verified" && user.isVerified) ||
      (statusFilter === "not_verified" && !user.isVerified)

    return matchesSearch && matchesRole && matchesStatus
  })

  const handleEnrollUser = async (userId) => {
    setIsProcessing(true)
    try {
      // Commented out API call
      const result = await enrollUser(userId);
      if (!result.success) {
        throw new Error(result.message);
      }
      
      // Simulate API call
      // await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUsers(users.map(user => {
        if (user.id === userId) {
          return { ...user, isVerified: true }
        }
        return user
      }))
      
      toast.success("Success", {
        description: "User has been enrolled successfully"
      })
    } catch (error) {
      toast.error("Error", {
        description: error.message || "Failed to enroll user"
      })
    } finally {
      setIsProcessing(false)
      setIsDialogOpen(false)
      setSelectedUser(null)
    }
  }

  const handleRevokeUser = async (userId) => {
    setIsProcessing(true)
    try {
      // Commented out API call
      const result = await revokeUser(userId);
      if (!result.success) {
        throw new Error(result.message);
      }
      
      // Simulate API call
      // await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUsers(users.map(user => {
        if (user.id === userId) {
          return { ...user, isVerified: false }
        }
        return user
      }))
      
      toast.success("Success", {
        description: "User has been revoked successfully"
      })
    } catch (error) {
      toast.error("Error", {
        description: error.message || "Failed to revoke user"
      })
    } finally {
      setIsProcessing(false)
      setIsDialogOpen(false)
      setSelectedUser(null)
    }
  }

  const roleOptions = [
    { value: "all", label: "All Roles" },
    { value: "user", label: "User" },
    { value: "admin", label: "Admin" },
    { value: "superadmin", label: "Super Admin" },
  ]

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "verified", label: "Verified" },
    { value: "not_verified", label: "Not Verified" },
  ]

  useEffect(() => { 
    getUsers();
  },[])

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 flex-1">
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Button 
            variant="outline" 
            size="icon"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCcw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Select Role" />
            </SelectTrigger>
            <SelectContent>
              {roleOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <UserManagementSkeleton />
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {user.role === ROLE.ADMIN || user.role === ROLE.SUPERADMIN ? (
                          <Shield className="mr-2 h-4 w-4 text-blue-500" />
                        ) : (
                          <User className="mr-2 h-4 w-4 text-gray-500" />
                        )}
                        <span className="capitalize">{user.role}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          user.isVerified ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.isVerified ? <Check className="mr-1 h-3 w-3" /> : <X className="mr-1 h-3 w-3" />}
                        <span className="capitalize">{user.isVerified ? "verified" : "not verified"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => {
                          setSelectedUser(user)
                          setIsDialogOpen(true)
                        }}
                      >
                        {user.isVerified ? "Revoke" : "Enroll"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No users found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedUser?.isVerified ? "Revoke User" : "Enroll User"}
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to {selectedUser?.isVerified ? "revoke" : "enroll"} {selectedUser?.email}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDialogOpen(false)
                setSelectedUser(null)
              }}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button 
              variant={selectedUser?.isVerified ? "destructive" : "success"}
              onClick={() => {
                if (selectedUser?.isVerified) {
                  handleRevokeUser(selectedUser.id)
                } else {
                  handleEnrollUser(selectedUser.id)
                }
              }}
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : selectedUser?.isVerified ? "Revoke" : "Enroll"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
