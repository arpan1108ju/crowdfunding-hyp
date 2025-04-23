"use client"

import { useState } from "react"
import { Check, X, Shield, User } from "lucide-react"

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

type UserType = {
  id: string
  email: string
  role: "user" | "admin" | "superadmin"
  status: "active" | "inactive"
}

export function UserManagement() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [isEnrolling, setIsEnrolling] = useState(false)
  const [newUserEmail, setNewUserEmail] = useState("")

  // Mock data - would come from API in real app
  const [users, setUsers] = useState<UserType[]>([
    { id: "1", email: "user1@example.com", role: "user", status: "active" },
    { id: "2", email: "user2@example.com", role: "user", status: "active" },
    { id: "3", email: "user3@example.com", role: "user", status: "inactive" },
    { id: "4", email: "admin1@example.com", role: "admin", status: "active" },
  ])

  const filteredUsers = users.filter((user) => user.email.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleEnrollUser = () => {
    setIsEnrolling(true)
    // Simulate API call
    setTimeout(() => {
      const newUser: UserType = {
        id: (users.length + 1).toString(),
        email: newUserEmail,
        role: "user",
        status: "active",
      }
      setUsers([...users, newUser])
      setNewUserEmail("")
      setIsEnrolling(false)
      toast({
        title: "Success",
        description: "User has been enrolled successfully",
      })
    }, 1000)
  }

  const toggleUserStatus = (userId: string) => {
    setUsers(
      users.map((user) => {
        if (user.id === userId) {
          return {
            ...user,
            status: user.status === "active" ? "inactive" : "active",
          }
        }
        return user
      }),
    )

    toast({
      title: "Success",
      description: "User status has been updated",
    })
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
        <Dialog>
          <DialogTrigger asChild>
            <Button>Enroll User</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Enroll New User</DialogTitle>
              <DialogDescription>Enter the email address of the user you want to enroll.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="email">Email</label>
                <Input
                  id="email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="user@example.com"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleEnrollUser} disabled={!newUserEmail || isEnrolling}>
                {isEnrolling ? "Enrolling..." : "Enroll User"}
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
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
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
                      {user.role === "admin" || user.role === "superadmin" ? (
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
                        user.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.status === "active" ? <Check className="mr-1 h-3 w-3" /> : <X className="mr-1 h-3 w-3" />}
                      <span className="capitalize">{user.status}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => toggleUserStatus(user.id)}>
                      {user.status === "active" ? "Revoke" : "Activate"}
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
    </div>
  )
}
