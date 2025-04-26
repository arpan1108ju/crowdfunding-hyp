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
import { ROLE } from "@/lib/constants"
import { EnrollRevokeSkeleton } from "@/components/enroll-revoke-Skeleton"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"

export function EnrollRevokeManagement({fetchAll,enroll,revoke,fetchSingle,isCallerSuperAdmin,
  changeRole
}) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUser, setSelectedUser] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  
  
  const [users, setUsers] = useState([]);
  const [userDetails, setUserDetails] = useState(null);
  const [isUserDetailsDialogOpen, setIsUserDetailsDialogOpen] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [isRoleChangeDialogOpen, setIsRoleChangeDialogOpen] = useState(false);
  const [roleChangeDetails, setRoleChangeDetails] = useState(null);
  const [isChangingRole, setIsChangingRole] = useState(false);

  const getUsers = async () => {
    setIsLoading(true)
    try {
      const result = await fetchAll();
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
    const matchesRole = roleFilter === "all" || user.role.toLowerCase() === roleFilter.toLowerCase();
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "verified" && user.isVerified) ||
      (statusFilter === "not_verified" && !user.isVerified)

    return matchesSearch && matchesRole && matchesStatus
  })

  const handleEnroll = async (userId) => {
    setIsProcessing(true)
    try {
      // Commented out API call
      const result = await enroll(userId);
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
        description: `${gotUser.email} has been enrolled successfully`
      })
    } catch (error) {
      toast.error("Error", {
        description: error.message || `Failed to enroll ${gotUser.email}`
      })
    } finally {
      setIsProcessing(false)
      setIsDialogOpen(false)
      setSelectedUser(null)
    }
  }

  const handleRevoke = async (userId) => {
    setIsProcessing(true)
    try {
      // Commented out API call
      const result = await revoke(userId);
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

  const handleRowClick = async (user) => {
    setIsLoadingDetails(true);
    try {
      const result = await fetchSingle(user.id);
      if (!result.success) {
        throw new Error(result.message);
      }
      setUserDetails(result.data);
      setIsUserDetailsDialogOpen(true);
    } catch (error) {
      toast.error("Error", {
        description: error.message || "Failed to fetch user details"
      });
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const roleOptions = [
    { value: "all", label: "All Roles" },
    { value: ROLE.USER, label: ROLE.USER },
    { value: ROLE.ADMIN, label: ROLE.ADMIN },
    { value: ROLE.SUPERADMIN, label: ROLE.SUPERADMIN },
  ]

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "verified", label: "Verified" },
    { value: "not_verified", label: "Not Verified" },
  ]

  // Available roles for dropdown
  const availableRoles = Object.values(ROLE);

  // Handle role selection from dropdown
  const handleRoleSelect = (user, newRole) => {
    if (user.role !== newRole) {
      setRoleChangeDetails({
        userId: user.id,
        currentRole: user.role,
        newRole: newRole,
        userEmail: user.email
      });
      setIsRoleChangeDialogOpen(true);
    }
  };

  // Handle role change confirmation
  const handleRoleChangeConfirm = async () => {
    if (!roleChangeDetails) return;

    setIsChangingRole(true);
    try {
      const result = await changeRole(roleChangeDetails.userId, roleChangeDetails.newRole);
      if (!result.success) {
        throw new Error(result.message);
      }

      // Update local users state
      setUsers(users.map(user => 
        user.id === roleChangeDetails.userId 
          ? { ...user, role: roleChangeDetails.newRole }
          : user
      ));

      toast.success("Success", {
        description: `Role changed successfully from ${roleChangeDetails.currentRole} to ${roleChangeDetails.newRole}`
      });
      setIsRoleChangeDialogOpen(false);
    } catch (error) {
      toast.error("Error", {
        description: error.message || "Failed to change role"
      });
    } finally {
      setIsChangingRole(false);
    }
  };

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
        <EnrollRevokeSkeleton />
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
                  <TableRow 
                    key={user.id}
                    className="cursor-pointer"
                    onClick={(e) => {
                      // Prevent row click when clicking on actions
                      if (!e.target.closest('.actions-column')) {
                        handleRowClick(user);
                      }
                    }}
                  >
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {user.role === ROLE.ADMIN ? (
                          <Shield className="mr-2 h-4 w-4 text-blue-500" />
                        ) : user.role === ROLE.SUPERADMIN ? (
                          <Shield className="mr-2 h-4 w-4 text-purple-600" />
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
                    <TableCell className="text-right actions-column">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedUser(user);
                            setIsDialogOpen(true);
                          }}
                        >
                          {user.isVerified ? "Revoke" : "Enroll"}
                        </Button>

                        {isCallerSuperAdmin && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={(e) => e.stopPropagation()}
                              >
                                Change Role
                                <ChevronDown className="ml-2 h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {availableRoles.map((role) => (
                                <DropdownMenuItem
                                  key={role}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRoleSelect(user, role);
                                  }}
                                  disabled={user.role === role}
                                  className={
                                    user.role === role
                                      ? "bg-muted text-muted-foreground cursor-not-allowed"
                                      : ""
                                  }
                                >
                                  {role}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                      </div>
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
                  handleRevoke(selectedUser.id)
                } else {
                  handleEnroll(selectedUser.id)
                }
              }}
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : selectedUser?.isVerified ? "Revoke" : "Enroll"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isUserDetailsDialogOpen} onOpenChange={setIsUserDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {isLoadingDetails ? (
            <div className="space-y-4">
              <div className="h-4 w-full bg-gray-200 animate-pulse rounded" />
              <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded" />
              <div className="h-4 w-1/2 bg-gray-200 animate-pulse rounded" />
            </div>
          ) : userDetails ? (
            <div className="grid gap-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="font-medium">Email:</label>
                <div className="col-span-3">{userDetails.email}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="font-medium">Username:</label>
                <div className="col-span-3">{userDetails.username}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="font-medium">Role:</label>
                <div className="col-span-3 capitalize">{userDetails.role}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="font-medium">Verification:</label>
                <div className="col-span-3">
                  <div
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      userDetails.isVerified ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {userDetails.isVerified ? <Check className="mr-1 h-3 w-3" /> : <X className="mr-1 h-3 w-3" />}
                    <span className="capitalize">{userDetails.isVerified ? "Verified" : "Not Verified"}</span>
                  </div>
                </div>
              </div>
              {userDetails.x509Identity && (
                <>
                  <div className="grid grid-cols-4 items-start gap-4">
                    <label className="font-medium">Certificate:</label>
                    <div className="col-span-3">
                      <pre className="text-xs bg-gray-50 p-2 rounded overflow-auto max-h-40">
                        {userDetails.x509Identity.credentials.certificate}
                      </pre>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-start gap-4">
                    <label className="font-medium">Private Key:</label>
                    <div className="col-span-3">
                      <pre className="text-xs bg-gray-50 p-2 rounded overflow-auto max-h-40">
                        {userDetails.x509Identity.credentials.privateKey}
                      </pre>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="text-center text-gray-500">No user details available</div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUserDetailsDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Role Change Confirmation Dialog */}
      <Dialog open={isRoleChangeDialogOpen} onOpenChange={setIsRoleChangeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change User Role</DialogTitle>
            <DialogDescription>
              Are you sure you want to change the role of user "{roleChangeDetails?.userEmail}" from{" "}
              <span className="font-semibold">{roleChangeDetails?.currentRole}</span> to{" "}
              <span className="font-semibold">{roleChangeDetails?.newRole}</span>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsRoleChangeDialogOpen(false)}
              disabled={isChangingRole}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={handleRoleChangeConfirm}
              disabled={isChangingRole}
            >
              {isChangingRole ? "Changing..." : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
