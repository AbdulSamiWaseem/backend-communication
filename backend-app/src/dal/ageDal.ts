import { randomUUID } from "crypto";
import axios from "axios";

const THIRD_PARTY_URL =
  process.env.THIRD_PARTY_URL || "http://localhost:4001";

type AgeResult = {
  jobId: string;
  dob: string;
  age: number;
};

type Pending = {
  resolve: (value: AgeResult) => void;
  reject: (error: Error) => void;
  timer: NodeJS.Timeout;
};

const pending = new Map<string, Pending>();

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

export const waitForCallback = (
  jobId: string,
  timeoutMs = 60_000
): Promise<AgeResult> =>
  new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      pending.delete(jobId);
      reject(new Error(`Timed out waiting for callback (job ${jobId})`));
    }, timeoutMs);

    pending.set(jobId, { resolve, reject, timer });
  });

export const resolveCallback = (result: AgeResult): boolean => {
  const entry = pending.get(result.jobId);
  if (!entry) return false;
  clearTimeout(entry.timer);
  pending.delete(result.jobId);
  entry.resolve(result);
  return true;
};

export const cancelPending = (jobId: string) => {
  const entry = pending.get(jobId);
  if (!entry) return;
  clearTimeout(entry.timer);
  pending.delete(jobId);
};

export const createJobId = () => randomUUID();
