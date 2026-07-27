"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { clearToken, getApi, getToken, postApi, setToken } from "@/lib/api";

const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (!getToken()) {
        setIsLoading(false);
        return;
      }

      const data = await getApi("/auth/me");
      if (data) setUser(data);
      else clearToken();

      setIsLoading(false);
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await postApi("/auth/login", { email, password });
    if (!res?.data) return false;

    setToken(res.data.access_token);
    setUser(res.data.user);
    return true;
  };

  const logout = () => {
    clearToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
