"use client"

import { useEffect, useState } from "react"
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

import { toast } from "sonner"
import { useAdminService } from "@/hooks/use-admin-service"
import { ROLE } from "@/lib/constants"



export function UserManagement() {

  const [searchTerm, setSearchTerm] = useState("")
  const [isEnrolling, setIsEnrolling] = useState(false)
  const [newUserEmail, setNewUserEmail] = useState("")
  
  
  
  const { fetchAllUsers } = useAdminService();
  
  const [users, setUsers] = useState([]);
  // Mock data - would come from API in real app
  // const [users, setUsers] = useState([
  //   { id: "1", email: "user1@example.com", role: ROLE.USER, isVerified: "verified" },
  //   { id: "2", email: "user2@example.com", role: ROLE.USER, isVerified: "verified" },
  //   { id: "3", email: "user3@example.com", role: ROLE.USER, isVerified: "not verified" },
  //   { id: "4", email: "admin1@example.com", role: ROLE.ADMIN, isVerified: "verified" },
  // ])

  useEffect(() => {
     
    const getUsers = async () => {
       const result = await fetchAllUsers();
       
       if(!result.success){
          toast.error("Error",{
            description : result.message
          })
          return;
       }
       

       console.log('res : ',result);
       setUsers(result.data);
    }
    getUsers();


  },[])


  const filteredUsers = users.filter((user) => user.email.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleEnrollUser = () => {
    setIsEnrolling(true)
    // Simulate API call
    setTimeout(() => {
      const newUser = {
        id: (users.length + 1).toString(),
        email: newUserEmail,
        role: ROLE.USER,
        isVerified: true,
      }
      setUsers([...users, newUser])
      setNewUserEmail("")
      setIsEnrolling(false)
      toast.success("Success",{
        description: "User has been enrolled successfully",
      })
    }, 1000)
  }

  const toggleUserisVerified = (userId) => {

    


    setUsers(
      users.map((user) => {
        if (user.id === userId) {
          return {
            ...user,
            isVerified: user.isVerified,
          }
        }
        return user
      }),
    )

    toast.success("Success",{
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
              <DialogTitle>Enroll User</DialogTitle>
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
                    <Button variant="outline" size="sm" onClick={() => toggleUserisVerified(user.id)}>
                      {user.isVerified? "Revoke" : "Enroll"}
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
