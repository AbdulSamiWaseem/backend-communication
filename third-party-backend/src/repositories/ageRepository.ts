import { randomUUID } from "crypto";
import { Job } from "../domain/ageJob";

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
