import axios from "axios";

const TOKEN_KEY = "access_token";

export const getToken = () =>
  typeof window === "undefined" ? null : localStorage.getItem(TOKEN_KEY);

export const setToken = (token: string) => localStorage.setItem(TOKEN_KEY, token);

export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

const baseUrl = () => process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

const authHeaders = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};


export const getApi = async (route: string) => {
  try {
    const res = await axios.get(`${baseUrl()}${route}`, {
      headers: authHeaders(),
    });
    return res.data.data;
  } catch (e: any) {
    if (e?.response?.status === 401) clearToken();
    return null;
  }
};

export const postApi = async (route: string, payload: any) => {
  try {
    const res = await axios.post(`${baseUrl()}${route}`, payload, {
      headers: authHeaders(),
    });
    return res.data;
  } catch (e: any) {
    if (e?.response?.status === 401) clearToken();
    return null;
  }
};
