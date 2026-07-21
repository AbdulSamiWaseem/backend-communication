import {
  callThirdParty,
  pollThirdPartyJob,
} from "../clients/thirdPartyClient";
import {
  cancelPending,
  createJobId,
  resolveCallback,
  waitForCallback,
} from "../repositories/pendingRequestsRepository";
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

  if (mode === "polling") {
    return fetchWithPolling(dob, resp);
  }

  if (mode === "mqtt") {
    return fetchWithMqtt(dob, resp);
  }

  if (mode === "webhook") {
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

export const acceptAgeCallback = async (
  jobId: string,
  dob: string,
  age: number,
  resp: ResponseObject
) => {
  const ok = resolveCallback({ jobId, dob: String(dob), age: Number(age) });
  if (!ok) {
    return {
      error: true,
      error_message: `No pending request for job ${jobId}`,
    };
  }

  return {
    ...resp,
    success_message: "Callback received",
  };
};

const fetchWithPolling = async (dob: string, resp: ResponseObject) => {
  try {
    const start = await callThirdParty({
      dob,
      mode: "polling",
    });

    if (start.code !== 200) {
      return {
        error: true,
        error_message: start.message || "Third-party failed to start job",
      };
    }

    const jobId = start.data.jobId;
    console.log(`[polling] started job ${jobId}, polling every 2s`);

    const result = await pollThirdPartyJob(jobId);

    return {
      ...resp,
      success_message: "Age retrieved successfully",
      data: {
        dob: result.dob,
        age: result.age,
        jobId: result.jobId,
        mode: "polling",
      },
    };
  } catch (error: any) {
    return {
      error: true,
      error_message: error.message || "Polling mode failed",
    };
  }
};

const fetchWithMqtt = async (dob: string, resp: ResponseObject) => {
  const jobId = createJobId();
  const waitPromise = waitForCallback(jobId);

  try {
    const start = await callThirdParty({
      dob,
      mode: "mqtt",
      jobId,
    });

    if (start.code !== 200) {
      cancelPending(jobId);
      return {
        error: true,
        error_message: start.message || "Third-party failed to start job",
      };
    }

    console.log(`[mqtt] started job ${jobId}, waiting for broker message`);
    const result = await waitPromise;

    return {
      ...resp,
      success_message: "Age retrieved successfully",
      data: {
        dob: result.dob,
        age: result.age,
        jobId: result.jobId,
        mode: "mqtt",
      },
    };
  } catch (error: any) {
    cancelPending(jobId);
    return {
      error: true,
      error_message: error.message || "MQTT mode failed",
    };
  }
};
