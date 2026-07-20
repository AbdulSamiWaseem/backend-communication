import axios from "axios";
import { computeAgeFromDob } from "../dal/ageDal";
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

  // Do not await — return pending right away
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
