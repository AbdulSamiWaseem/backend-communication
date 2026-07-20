import {
  callThirdParty,
  cancelPending,
  createJobId,
  waitForCallback,
} from "../dal/ageDal";
import { ResponseObject } from "../utils/constants";

export const fetchAge = async (
  dob: string,
  queryMode: string | undefined,
  resp: ResponseObject
) => {
  const mode = (queryMode || "callback").toLowerCase();
  console.log(`[ageService] mode=${mode} dob=${dob}`);

  if (mode === "callback") {
    return fetchWithCallback(dob, resp);
  }

  if (mode === "polling" || mode === "webhook" || mode === "mqtt") {
    return {
      error: true,
      error_message: `${mode} mode is not implemented yet on backend-app`,
    };
  }

  return { error: true, error_message: `Invalid mode: ${mode}` };
};

const fetchWithCallback = async (dob: string, resp: ResponseObject) => {
  const jobId = createJobId();
  const baseUrl = process.env.BACKEND_APP_URL || "http://localhost:4000";
  const callbackUrl = `${baseUrl}/api/callbacks/age/${jobId}`;
  const waitPromise = waitForCallback(jobId);

  try {
    const start = await callThirdParty({
      dob,
      mode: "callback",
      callbackUrl,
      jobId,
    });

    if (start.code !== 200) {
      cancelPending(jobId);
      return {
        error: true,
        error_message: start.message || "Third-party failed to start job",
      };
    }

    const result = await waitPromise;

    return {
      ...resp,
      success_message: "Age retrieved successfully",
      data: {
        dob: result.dob,
        age: result.age,
        jobId: result.jobId,
        mode: "callback",
      },
    };
  } catch (error: any) {
    cancelPending(jobId);
    return {
      error: true,
      error_message: error.message || "Callback mode failed",
    };
  }
};
