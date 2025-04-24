import { notFound, redirect } from "next/navigation"
import { Shield, UserCog } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { AdminManagement } from "@/components/superadmin/admin-management"
import { RoleManagement } from "@/components/superadmin/role-management"
import { useAuth } from "@/hooks/use-auth"

export default async function SuperAdminPage() {
  const {session } = useAuth();


  if (!session) {
    redirect("/login")
  }

  if (session.role !== "superadmin") {
    notFound()
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Super Admin Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Admins</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">+1 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Role Changes</CardTitle>
            <UserCog className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="admins" className="mt-6">
        <TabsList>
          <TabsTrigger value="admins">Admin Management</TabsTrigger>
          <TabsTrigger value="roles">Role Management</TabsTrigger>
        </TabsList>
        <TabsContent value="admins" className="mt-4">
          <AdminManagement />
        </TabsContent>
        <TabsContent value="roles" className="mt-4">
          <RoleManagement />
        </TabsContent>
      </Tabs>
    </div>
  )
}
