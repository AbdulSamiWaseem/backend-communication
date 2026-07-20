import axios from "axios";
import {
  completeJob,
  computeAgeFromDob,
  createJob,
  failJob,
  getJob,
} from "../dal/ageDal";
import { ResponseObject } from "../utils/constants";

const ageCallback = async (
  dob: string,
  callbackUrl: string | undefined,
  jobId: string | undefined,
  resp: ResponseObject
) => {
  if (!callbackUrl) {
    return {
      error: true,
      error_message: "callbackUrl is required for callback mode",
    };
  }

  if (!jobId) {
    return {
      error: true,
      error_message: "jobId is required for callback mode",
    };
  }

  void (async () => {
    try {
      const result = await computeAgeFromDob(dob);
      console.log(`[callback] posting result for job ${jobId} → ${callbackUrl}`);
      await axios.post(callbackUrl, {
        jobId,
        dob: result.dob,
        age: result.age,
      });
      console.log(`[callback] delivered job ${jobId}`);
    } catch (error: any) {
      console.error(`[callback] failed for job ${jobId}:`, error.message);
    }
  })();

  return {
    ...resp,
    success_message: "Age calculation started",
    data: {
      jobId,
      status: "pending",
      mode: "callback",
    },
  };
};

const agePolling = async (dob: string, resp: ResponseObject) => {
  const job = createJob(dob);

  void (async () => {
    try {
      const result = await computeAgeFromDob(dob);
      completeJob(job.jobId, result.age);
      console.log(`[polling] job ${job.jobId} completed, age=${result.age}`);
    } catch (error: any) {
      failJob(job.jobId, error.message || "Calculation failed");
      console.error(`[polling] job ${job.jobId} failed:`, error.message);
    }
  })();

  return {
    ...resp,
    success_message: "Age calculation started",
    data: {
      jobId: job.jobId,
      status: "pending",
      mode: "polling",
    },
  };
};

export const fetchAge = async (
  dob: string,
  queryMode: string | undefined,
  callbackUrl: string | undefined,
  jobId: string | undefined,
  resp: ResponseObject
) => {
  try {
    const mode = (queryMode || "callback").toLowerCase();
    console.log(`[ageService] mode=${mode} dob=${dob}`);

    switch (mode) {
      case "callback":
        return ageCallback(dob, callbackUrl, jobId, resp);
      case "polling":
        return agePolling(dob, resp);
      case "webhook":
      case "mqtt":
        return {
          error: true,
          error_message: `${mode} mode is not implemented yet on third-party-backend`,
        };
      default:
        return {
          error: true,
          error_message: `Invalid mode: ${mode}`,
        };
    }
  } catch (error: any) {
    return {
      error: true,
      error_message: error.message || "Failed to resolve age",
    };
  }
};

export const getJobStatus = async (jobId: string, resp: ResponseObject) => {
  const job = getJob(jobId);

  if (!job) {
    return {
      error: true,
      error_message: `Job not found: ${jobId}`,
    };
  }

  if (job.status === "failed") {
    return {
      error: true,
      error_message: job.error || "Job failed",
    };
  }

  return {
    ...resp,
    success_message: "Job status retrieved",
    data: {
      jobId: job.jobId,
      status: job.status,
      dob: job.dob,
      ...(job.status === "completed" ? { age: job.age } : {}),
      mode: "polling",
    },
  };
};
