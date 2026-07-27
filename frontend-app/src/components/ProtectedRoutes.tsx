"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
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
  if (path === "/admin" && user?.role !== "admin") {
    return <p className="m-auto p-8 text-slate-500">Access denied</p>;
  }

  return children;
}
