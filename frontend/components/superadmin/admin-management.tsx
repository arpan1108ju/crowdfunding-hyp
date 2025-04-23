"use client"

import { useState } from "react"
import { Check, X, Shield } from "lucide-react"

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
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"

type AdminType = {
  id: string
  email: string
  status: "active" | "inactive"
  campaigns: number
}

export function AdminManagement() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [isEnrolling, setIsEnrolling] = useState(false)
  const [newAdminEmail, setNewAdminEmail] = useState("")

  // Mock data - would come from API in real app
  const [admins, setAdmins] = useState<AdminType[]>([
    { id: "1", email: "admin1@example.com", status: "active", campaigns: 3 },
    { id: "2", email: "admin2@example.com", status: "active", campaigns: 2 },
    { id: "3", email: "admin3@example.com", status: "inactive", campaigns: 0 },
  ])

  const filteredAdmins = admins.filter((admin) => admin.email.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleEnrollAdmin = () => {
    setIsEnrolling(true)
    // Simulate API call
    setTimeout(() => {
      const newAdmin: AdminType = {
        id: (admins.length + 1).toString(),
        email: newAdminEmail,
        status: "active",
        campaigns: 0,
      }
      setAdmins([...admins, newAdmin])
      setNewAdminEmail("")
      setIsEnrolling(false)
      toast({
        title: "Success",
        description: "Admin has been enrolled successfully",
      })
    }, 1000)
  }

  const toggleAdminStatus = (adminId: string) => {
    setAdmins(
      admins.map((admin) => {
        if (admin.id === adminId) {
          return {
            ...admin,
            status: admin.status === "active" ? "inactive" : "active",
          }
        }
        return admin
      }),
    )

    toast({
      title: "Success",
      description: "Admin status has been updated",
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Search admins..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Dialog>
          <DialogTrigger asChild>
            <Button>Enroll Admin</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Enroll New Admin</DialogTitle>
              <DialogDescription>Enter the email address of the user you want to enroll as an admin.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="email">Email</label>
                <Input
                  id="email"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  placeholder="admin@example.com"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleEnrollAdmin} disabled={!newAdminEmail || isEnrolling}>
                {isEnrolling ? "Enrolling..." : "Enroll Admin"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

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
                    <Button variant="outline" size="sm" onClick={() => toggleAdminStatus(admin.id)}>
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
    </div>
  )
}
