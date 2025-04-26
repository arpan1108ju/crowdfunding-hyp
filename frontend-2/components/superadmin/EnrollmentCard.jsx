'use client';

import { useState } from "react";
import { Shield, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useSuperadminService } from "@/hooks/use-superadmin-service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useUserService } from "@/hooks/use-user-service";

export function EnrollmentCard({x509Identity}) {
  const { enrollSuperadmin } = useSuperadminService();
  const { reEnrollUser } = useUserService();
  const [isEnrolling, setIsEnrolling] = useState(false);
  const { save } = useAuth();
  const router = useRouter();

  const isEnrolled = (x509Identity !== null && x509Identity !== undefined);

  const handleEnrollSelf = async () => {
    setIsEnrolling(true);
    try {
      const response = await enrollSuperadmin();
      if(!response.success){
        throw new Error(response.message);
      }
      
      // Update session with new x509Identity
      save(response?.data);
      
      toast.success("Successfully enrolled");
      
      // Reload the page to refresh the x509Identity
      router.refresh();
    } catch (error) {
      toast.error("Failed to enroll", {
        description: error.message || "Something went wrong"
      });
    } finally {
      setIsEnrolling(false);
    }
  };

  const handleReEnroll = async () => {
    setIsEnrolling(true);
    try {
      const response = await reEnrollUser();
      if(!response.success){
        throw new Error(response.message);
      }
      
      // Update session with new x509Identity
      save(response?.data);
      
      toast.success("Successfully re-enrolled");
      
      // Reload the page to refresh the x509Identity
      router.refresh();
    } catch (error) {
      toast.error("Failed to re-enroll", {
        description: error.message || "Something went wrong"
      });
    } finally {
      setIsEnrolling(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Enrollment Status</CardTitle>
        {isEnrolled ? (
          <Shield className="h-4 w-4 text-green-500" />
        ) : (
          <Shield className="h-4 w-4 text-red-500" />
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="text-lg font-semibold">
              {isEnrolled ? "Enrolled" : "Not Enrolled"}
            </div>
            <p className="text-sm text-muted-foreground">
              {isEnrolled 
                ? "You have valid X.509 credentials" 
                : "You need to enroll to get X.509 credentials"}
            </p>
          </div>
          <div>
            {!isEnrolled ? (
              <Button
                onClick={handleEnrollSelf}
                disabled={isEnrolling}
                className="w-full"
              >
                {isEnrolling ? "Enrolling..." : "Enroll Self"}
              </Button>
            ) : (
              <Button
                onClick={handleReEnroll}
                disabled={isEnrolling}
                variant="outline"
                className="w-full"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                {isEnrolling ? "Re-enrolling..." : "Re-enroll"}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 