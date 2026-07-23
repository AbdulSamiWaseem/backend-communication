import axios from "axios";

const PROVIDER_BASE_URL =
  process.env.THIRD_PARTY_URL || "http://localhost:4001";
const PROVIDER_REDIRECT_URI =
  process.env.PROVIDER_REDIRECT_URI ||
  "http://localhost:4000/api/auth/provider/callback";

export const getProviderAuthUrl = (): string => {
  const params = new URLSearchParams({
    redirect_uri: PROVIDER_REDIRECT_URI,
  });
  return `${PROVIDER_BASE_URL}/oauth/authorize?${params.toString()}`;
};

export const exchangeProviderCodeForTokens = async (code: string) => {
  const { data } = await axios.post(
    `${PROVIDER_BASE_URL}/oauth/token`,
    {
      code,
      redirect_uri: PROVIDER_REDIRECT_URI,
    },
    {
      headers: { "Content-Type": "application/json" },
      timeout: 10_000,
    }
  );
  return data;
};

export const fetchProviderUserInfo = async (accessToken: string) => {
  const { data } = await axios.get(`${PROVIDER_BASE_URL}/oauth/userinfo`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    timeout: 10_000,
  });
  return data;
};
