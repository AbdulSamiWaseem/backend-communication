"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { hasPermission, NAV_ITEMS } from "@/lib/access";
import { useAuth } from "./AuthProvider";

export function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  const links = NAV_ITEMS.filter((item) =>
    hasPermission(user.permissions, item.permission)
  );

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
        <nav className="flex flex-wrap gap-4 text-sm font-medium text-slate-600">
          {links.map((item) => (
            <Link key={item.path} href={item.path} className="hover:text-slate-900">
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="rounded-md border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50"
        >
          Log out
        </button>
      </div>
    </header>
  );
}
