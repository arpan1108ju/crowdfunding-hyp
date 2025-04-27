'use client';

import { notFound, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";
import { ProfileLoadingSkeleton } from "@/components/profile/loading-skeleton";
import { ROLE } from "@/lib/constants";
import { UserInfo } from "@/components/profile/UserInfo";
import { Wallet } from "@/components/profile/Wallet";
import { PaymentHistory } from "@/components/profile/PaymentHistory";
import { TokenMintHistory } from "@/components/profile/TokenMintHistory";
import { Separator } from "@/components/ui/separator";

export default function ProfilePage() {
  const router = useRouter();
  const { session, loading } = useAuth();
  
  useEffect(() => {
    if (!loading && !session) {
      router.push("/login");
      return;
    }
  }, [session, router, loading]);

  if (loading) {
    return <ProfileLoadingSkeleton />;
  }

  if (!session) {
    return null;
  }

  if (session.role !== ROLE.USER && session.role !== ROLE.ADMIN && session.role !== ROLE.SUPERADMIN) {
    notFound();
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Hi {session.username}</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <UserInfo />
        <Wallet />
      </div>

      <Separator className="my-8" />
      
      <div className="space-y-6">
        <PaymentHistory />
        <TokenMintHistory />
      </div>
    </div>
  );
}
