import { randomUUID } from "crypto";

type JobStatus = "pending" | "completed" | "failed";

type Job = {
  jobId: string;
  dob: string;
  status: JobStatus;
  age?: number;
  error?: string;
};

const jobs = new Map<string, Job>();

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
