'use client';

import { useState } from "react";
import { Shield, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useSuperadminService } from "@/hooks/use-superadmin-service";
import { toast } from "sonner";

export function EnrollmentCard({x509Identity}) {
  const { enrollSuperadmin } = useSuperadminService();
  const [isEnrolling, setIsEnrolling] = useState(false);

  const isEnrolled = (x509Identity !== null && x509Identity !== undefined);

  const handleEnrollSelf = async () => {
    setIsEnrolling(true);
    try {
      const response = await enrollSuperadmin();
      if(!response.success){
        throw new Error(response.message);
      }
      toast.success("Successfully enrolled");
    } catch (error) {
      toast.error("Failed to enroll", {
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
                onClick={handleEnrollSelf}
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