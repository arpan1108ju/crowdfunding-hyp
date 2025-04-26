'use client';

import { useEffect, useState } from "react";
import { useUserService } from "@/hooks/use-user-service";
import { toast } from "sonner";
import { Shield, AlertCircle } from "lucide-react";
import { usePathname } from "next/navigation";

// List of paths that don't require verification

const AUTH_PATHS = [
  '/login',
  '/signup'
]


export function VerificationWrapper({ children }) {

  const pathname = usePathname();
    // Return early for auth paths
  if (AUTH_PATHS.includes(pathname)) {
    return children;
  }


  const [isVerified, setIsVerified] = useState(false);
  const [isCheckingVerification, setIsCheckingVerification] = useState(true);
  const { getUserSelf } = useUserService();

  const checkVerification = async () => {
    try {
      const result = await getUserSelf();
      if (!result.success) {
        throw new Error(result.message);
      }
      console.log('res : ',result);
      setIsVerified(result.data.isVerified);
    } catch (error) {
      toast.error("Error", {
        description: error.message || "Failed to check verification status"
      });
    } finally {
      setIsCheckingVerification(false);
    }
  };

  useEffect(() => {
    checkVerification();
  }, []);



  if (isCheckingVerification) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Shield className="h-12 w-12 mx-auto text-muted-foreground animate-pulse" />
          <h1 className="text-2xl font-semibold">Checking Verification Status</h1>
          <p className="text-muted-foreground">Please wait while we verify your account...</p>
        </div>
      </div>
    );
  }

  if (!isVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-6 max-w-md mx-auto px-4">
          <AlertCircle className="h-16 w-16 mx-auto text-red-300" />
          <h1 className="text-3xl font-bold">Not verified</h1>
        </div>
      </div>
    );
  }

  return children;
} 