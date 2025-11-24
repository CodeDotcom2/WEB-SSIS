"use client";

import { useAuth } from "@/app/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const { isLoggedIn, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect only if loading is finished AND user is not logged in
    if (!isLoading && !isLoggedIn) {
      router.push("/auth/login");
    }
  }, [isLoggedIn, isLoading, router]);

  // If loading, show a spinner or null. If logged in, show the children.
  if (isLoading || !isLoggedIn) {
    // You can replace this with a loading spinner component
    return (
      <div className="text-white text-center p-10">
        Loading authentication...
      </div>
    );
  }

  return <>{children}</>;
}
