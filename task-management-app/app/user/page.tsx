"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import LinkedInScraping from "@/components/dashboard/LinkedInScraping";
import ProfilePageupdate from "@/components/dashboard/ProfilePageupdate";
import { Card } from "@/components/ui/card";
import { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );

  const redirectToHome = useCallback(() => {
    if (!isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    redirectToHome();
  }, [redirectToHome]);

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background container mx-auto p-4">
      <Card className="max-w-2xl mx-auto">
        <ProfilePageupdate />
        <LinkedInScraping />
      </Card>
    </div>
  );
}
