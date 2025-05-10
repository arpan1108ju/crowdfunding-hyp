'use client';

import { notFound, useRouter } from "next/navigation"
import { Shield, UserCog } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminManagement } from "@/components/superadmin/admin-management"
import { EnrollmentCard } from "@/components/superadmin/EnrollmentCard"
import { useAuth } from "@/hooks/use-auth"
import { SuperAdminSkeleton } from "@/components/superadmin/loading-skeleton"
import { useEffect } from "react"
import { ROLE } from "@/lib/constants"

export default function SuperAdminPage() {
  const router = useRouter();
  const { session, loading } = useAuth();

  useEffect(() => {
    if (!loading && !session) {
      router.push("/login");
      return;
    }
  }, [session, router, loading]);

  if (loading) {
    return <SuperAdminSkeleton />;
  }

  if (!session) {
    return null;
  }

  if (session.role !== ROLE.SUPERADMIN) {
    notFound();
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Super Admin Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-3">
        <EnrollmentCard x509Identity={session?.x509Identity} />
        
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
          <TabsTrigger value="admins">User Management</TabsTrigger>
        </TabsList>
        <TabsContent value="admins" className="mt-4">
          <AdminManagement />
        </TabsContent>
      </Tabs>
    </div>
  )
}
