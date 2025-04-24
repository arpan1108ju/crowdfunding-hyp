'use client';

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ROLE } from "@/lib/constants";


export default function Home() {
  const { session } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      if (session.role === ROLE.ADMIN || session.role === ROLE.SUPERADMIN) {
        router.push("/admin");
      }
    }
  }, [session, router]);

  return (
    <div className="flex flex-col items-center justify-items-center p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="w-full max-w-full break-words">
        <Button className="whitespace-normal text-wrap"> My butt </Button>
      </div>
    </div>
  );
}
