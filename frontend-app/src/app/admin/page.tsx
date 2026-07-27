"use client";

import { useEffect, useState } from "react";
import { getApi } from "@/lib/api";

export default function AdminPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      setData(await getApi("/admin/overview"));
    };

    load();
  }, []);

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 p-6">
      <h1 className="text-2xl font-semibold">Admin</h1>
      {data && (
        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-3xl font-bold">{data.message}</p>
          <p className="mt-2 text-sm text-slate-500">{data.note}</p>
        </div>
      )}
    </main>
  );
}
