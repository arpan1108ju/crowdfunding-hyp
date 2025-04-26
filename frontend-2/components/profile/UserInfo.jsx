'use client';

import { User } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function UserInfo() {
  const { session } = useAuth();

  if (!session) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <User className="mr-2 h-5 w-5" />
          Account Information
        </CardTitle>
        <CardDescription>Your personal account details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Email</p>
          <p>{session.email}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Username</p>
          <p>{session.username}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Role</p>
          <p className="capitalize">{session.role}</p>
        </div>
      </CardContent>
    </Card>
  );
} 