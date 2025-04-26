'use client';

import { User, Eye, EyeOff, RefreshCcw } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserService } from "@/hooks/use-user-service";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Check, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { ROLE } from "@/lib/constants";
import { useAuth } from "@/hooks/use-auth";

export function UserInfo() {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSecret, setShowSecret] = useState(false);
  const [isReEnrolling, setIsReEnrolling] = useState(false);
  const { getUserSelf, reEnrollUser } = useUserService();
  const router = useRouter();
  const { save } = useAuth();

  const fetchUserData = async () => {
    try {
      const result = await getUserSelf();
      if (!result.success) {
        throw new Error(result.message);
      }
      setUserData(result.data);
      // Update session with new user data
      save(result.data);
    } catch (error) {
      toast.error("Error", {
        description: error.message || "Failed to fetch user data"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReEnroll = async () => {
    if (userData.role === ROLE.ADMIN) {
      router.push('/superadmin');
      return;
    }

    setIsReEnrolling(true);
    try {
      const result = await reEnrollUser();
      if (!result.success) {
        throw new Error(result.message);
      }
      // Update session with new user data after re-enrollment
      save(result.data);
      toast.success("Success", {
        description: "User re-enrolled successfully"
      });
      fetchUserData(); // Refresh user data
    } catch (error) {
      toast.error("Error", {
        description: error.message || "Failed to re-enroll user"
      });
    } finally {
      setIsReEnrolling(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="mr-2 h-5 w-5" />
            Account Information
          </CardTitle>
          <CardDescription>Loading your account details...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!userData) return null;

  const getStatusBadge = () => {
    if (userData.isRevoked) {
      return (
        <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-red-100 text-red-800">
          <X className="mr-1 h-3 w-3" />
          <span>Revoked</span>
        </div>
      );
    }
    if (userData.isVerified) {
      return (
        <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-green-100 text-green-800">
          <Check className="mr-1 h-3 w-3" />
          <span>Verified</span>
        </div>
      );
    }
    return (
      <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-yellow-100 text-yellow-800">
        <X className="mr-1 h-3 w-3" />
        <span>Not Verified</span>
      </div>
    );
  };

  const showReEnrollButton = () => userData.isVerified;

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
          <p>{userData.email}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Username</p>
          <p>{userData.username}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Role</p>
          <p className="capitalize">{userData.role}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Status</p>
          {getStatusBadge()}
        </div>
        {userData.secret && (
          <div>
            <p className="text-sm font-medium text-muted-foreground">Registration Secret</p>
            <div className="flex items-center gap-2">
              <p className="font-mono">{showSecret ? userData.secret : '••••••••••••••••'}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSecret(!showSecret)}
              >
                {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        )}
        {showReEnrollButton() && (
          <div className="pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReEnroll}
              disabled={isReEnrolling}
            >
              <RefreshCcw className={`mr-2 h-4 w-4 ${isReEnrolling ? 'animate-spin' : ''}`} />
              {isReEnrolling ? 'Re-enrolling...' : 'Re-enroll'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 