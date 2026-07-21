import axios from "axios";
import { AgeResult } from "../domain/ageResults";

const THIRD_PARTY_URL =
  process.env.THIRD_PARTY_URL || "http://localhost:4001";

export const callThirdParty = async (params: {
  dob: string;
  mode: string;
  callbackUrl?: string;
  jobId?: string;
}) => {
  const { data } = await axios.get(`${THIRD_PARTY_URL}/api/age`, {
    params,
    timeout: 10_000,
  });
  return data;
};

export const getThirdPartyJob = async (jobId: string) => {
  const { data } = await axios.get(
    `${THIRD_PARTY_URL}/api/age/jobs/${jobId}`,
    { timeout: 10_000 }
  );
  return data;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const pollThirdPartyJob = async (
  jobId: string,
  options?: { intervalMs?: number; timeoutMs?: number }
): Promise<AgeResult> => {
  const intervalMs = options?.intervalMs ?? 2_000;
  const timeoutMs = options?.timeoutMs ?? 60_000;
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    const response = await getThirdPartyJob(jobId);

    if (response.code !== 200) {
      throw new Error(response.message || "Failed to poll job");
    }

    const { status, dob, age } = response.data;

    if (status === "completed") {
      return { jobId, dob, age };
    }

    await sleep(intervalMs);
  }

  throw new Error(`Timed out polling job ${jobId}`);
};
