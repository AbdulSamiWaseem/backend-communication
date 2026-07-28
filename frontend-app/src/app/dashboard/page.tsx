"use client";

import { useAuth } from "@/components/AuthProvider";

export default function UserInfoPage() {
  const { user } = useAuth();

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 p-6">
      <h1 className="text-2xl font-semibold">User Info</h1>

      <div className="mt-6 space-y-2 rounded-xl border border-slate-200 bg-white p-6 text-sm shadow-sm">
        <p><span className="text-slate-500">Name:</span> {user?.name}</p>
        <p><span className="text-slate-500">Email:</span> {user?.email}</p>
        <p><span className="text-slate-500">Permissions:</span> {user?.permissions?.join(", ") || "—"}</p>
        <p><span className="text-slate-500">ID:</span> {user?.id}</p>
      </div>
    </main>
  );
}
