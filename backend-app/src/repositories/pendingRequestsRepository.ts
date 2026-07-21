import { randomUUID } from "crypto";
import { AgeResult } from "../domain/ageResults";

type Pending = {
  resolve: (value: AgeResult) => void;
  reject: (error: Error) => void;
  timer: NodeJS.Timeout;
};

const pending = new Map<string, Pending>();

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
