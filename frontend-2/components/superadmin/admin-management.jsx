"use client"

import { useEffect, useState } from "react"
import { Check, X, Shield, RefreshCcw } from "lucide-react"

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

import { AdminManagementSkeleton } from "./loading-skeleton"
import { useSuperadminService } from "@/hooks/use-superadmin-service"

export function AdminManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedAdmin, setSelectedAdmin] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState("all")
  

  const { fetchAllUsers, enrollAdmin, revokeAdmin } = useSuperadminService();
  
  const [admins, setAdmins] = useState([]);

  const getAdmins = async () => {
    setIsLoading(true)
    try {
      const result = await fetchAllUsers();
      if(!result.success){
        throw new Error(result.message);
      }
      setAdmins(result.data);
    } catch (error) {
      toast.error("Error", {
        description: error.message || "Failed to fetch admins"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefresh = () => {
    getAdmins()
  }

  const filteredAdmins = admins.filter((admin) => {
    const matchesSearch = admin.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || admin.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleenrollAdmin = async (adminId) => {
    setIsProcessing(true)
    try {
      const result = await enrollAdmin(adminId);
      if (!result.success) {
        throw new Error(result.message);
      }
      
      setAdmins(admins.map(admin => {
        if (admin.id === adminId) {
          return { ...admin, status: "active" }
        }
        return admin
      }))
      
      toast.success("Success", {
        description: "Admin has been enrolled successfully"
      })
    } catch (error) {
      toast.error("Error", {
        description: error.message || "Failed to enroll admin"
      })
    } finally {
      setIsProcessing(false)
      setIsDialogOpen(false)
      setSelectedAdmin(null)
    }
  }

  const handleRevokeAdmin = async (adminId) => {
    setIsProcessing(true)
    try {
      const result = await revokeAdmin(adminId);
      if (!result.success) {
        throw new Error(result.message);
      }
      
      setAdmins(admins.map(admin => {
        if (admin.id === adminId) {
          return { ...admin, status: "inactive" }
        }
        return admin
      }))
      
      toast.success("Success", {
        description: "Admin has been revoked successfully"
      })
    } catch (error) {
      toast.error("Error", {
        description: error.message || "Failed to revoke admin"
      })
    } finally {
      setIsProcessing(false)
      setIsDialogOpen(false)
      setSelectedAdmin(null)
    }
  }

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ]

  useEffect(() => { 
    getAdmins();
  },[])

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 flex-1">
          <Input
            placeholder="Search admins..."
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
        <AdminManagementSkeleton />
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Campaigns</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAdmins.length > 0 ? (
                filteredAdmins.map((admin) => (
                  <TableRow key={admin.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <Shield className="mr-2 h-4 w-4 text-blue-500" />
                        {admin.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          admin.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {admin.status === "active" ? <Check className="mr-1 h-3 w-3" /> : <X className="mr-1 h-3 w-3" />}
                        <span className="capitalize">{admin.status}</span>
                      </div>
                    </TableCell>
                    <TableCell>{admin.campaigns}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => {
                          setSelectedAdmin(admin)
                          setIsDialogOpen(true)
                        }}
                      >
                        {admin.status === "active" ? "Revoke" : "Activate"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No admins found.
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
              {selectedAdmin?.status === "active" ? "Revoke Admin" : "Activate Admin"}
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to {selectedAdmin?.status === "active" ? "revoke" : "activate"} {selectedAdmin?.email}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDialogOpen(false)
                setSelectedAdmin(null)
              }}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button 
              variant={selectedAdmin?.status === "active" ? "destructive" : "success"}
              onClick={() => {
                if (selectedAdmin?.status === "active") {
                  handleRevokeAdmin(selectedAdmin.id)
                } else {
                  handleenrollAdmin(selectedAdmin.id)
                }
              }}
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : selectedAdmin?.status === "active" ? "Revoke" : "Activate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
