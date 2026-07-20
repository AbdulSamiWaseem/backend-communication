import axios from "axios";

const THIRD_PARTY_URL =
  process.env.THIRD_PARTY_URL || "http://localhost:4001";

/**
 * HTTP access to third-party age API (mirrors DAL layer).
 * Phase 1+ will use these helpers from ageService.
 */
export const requestAgeFromThirdParty = async (params: {
  dob: string;
  mode: string;
  callbackUrl?: string;
}) => {
  const { data } = await axios.get(`${THIRD_PARTY_URL}/api/age`, {
    params,
    timeout: 10_000,
  });

  return data;
};
