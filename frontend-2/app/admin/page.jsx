'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Users, CreditCard } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { ROLE } from "@/lib/constants";
import { notFound } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { UserManagement } from "@/components/admin/user-management"
import { AdminSkeleton } from "@/components/admin/loading-skeleton";
import { TokenManagement } from "@/components/admin/token-management"


export default function AdminPage() {
  const router = useRouter();
  const { session, loading } = useAuth();

  
  useEffect(() => {
    if (!loading && !session) {
      router.push("/login");
      return;
    }
  }, [session, router, loading]);

  if (loading) {
    return <AdminSkeleton />;
  }

  // Check for unauthorized access
  if (!session) {
    return null; // Show nothing while redirecting to login
  }

  // Show NotFound for non-admin users
  if (session.role !== ROLE.ADMIN) {
    notFound();
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$145,678</div>
            <p className="text-xs text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users" className="mt-6">
        <TabsList>
          <TabsTrigger value="users">User Management</TabsTrigger>          
          <TabsTrigger value="tokens">Token Management</TabsTrigger>
        </TabsList>
        <TabsContent value="users" className="mt-4">
          <UserManagement />
        </TabsContent>
        <TabsContent value="tokens" className="mt-4">
          <TokenManagement />
        </TabsContent>
      </Tabs>
    </div>
  )
}
