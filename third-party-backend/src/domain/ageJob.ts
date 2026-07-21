export type JobStatus = "pending" | "completed" | "failed";

export type Job = {
  jobId: string;
  dob: string;
  status: JobStatus;
  age?: number;
  error?: string;
};
