"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { canAccessPath } from "@/lib/access";
import { useAuth } from "./AuthProvider";

export function ProtectedRoutes({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const path = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user && path !== "/login") {
      router.replace("/login");
    }
  }, [user, isLoading, path, router]);

  if (isLoading) return null;

  if (user && !canAccessPath(user.permissions, path)) {
    return (
      <p className="m-auto p-8 text-slate-500">
        You do not have permission to access this resource
      </p>
    );
  }

  return children;
}
