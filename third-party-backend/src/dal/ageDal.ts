import { randomUUID } from "crypto";

export type AgeResult = {
  dob: string;
  age: number;
  durationMs: number;
};

type JobStatus = "pending" | "completed" | "failed";

type Job = {
  jobId: string;
  dob: string;
  status: JobStatus;
  age?: number;
  error?: string;
};

const jobs = new Map<string, Job>();

/**
 * Simulates a slow third-party age calculation (30–40 seconds).
 */
export const computeAgeFromDob = async (dob: string): Promise<AgeResult> => {
  const delayMs = process.env.AGE_DELAY_MS
    ? Number(process.env.AGE_DELAY_MS)
    : 30_000 + Math.floor(Math.random() * 10_001);
  const birthDate = new Date(dob);

  console.log(
    `[age] computing age for ${dob} (~${Math.round(delayMs / 1000)}s)`
  );

  return new Promise((resolve, reject) => {
    if (Number.isNaN(birthDate.getTime())) {
      reject(new Error("Invalid date of birth"));
      return;
    }

    if (birthDate > new Date()) {
      reject(new Error("Date of birth cannot be in the future"));
      return;
    }

    setTimeout(() => {
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age -= 1;
      }

      console.log(`[age] finished for ${dob}: age=${age}`);
      resolve({
        dob,
        age,
        durationMs: delayMs,
      });
    }, delayMs);
  });
};

export const createJob = (dob: string): Job => {
  const job: Job = {
    jobId: randomUUID(),
    dob,
    status: "pending",
  };
  jobs.set(job.jobId, job);
  return job;
};

export const getJob = (jobId: string): Job | undefined => jobs.get(jobId);

export const completeJob = (jobId: string, age: number) => {
  const job = jobs.get(jobId);
  if (!job) return;
  job.status = "completed";
  job.age = age;
};

export const failJob = (jobId: string, error: string) => {
  const job = jobs.get(jobId);
  if (!job) return;
  job.status = "failed";
  job.error = error;
};
