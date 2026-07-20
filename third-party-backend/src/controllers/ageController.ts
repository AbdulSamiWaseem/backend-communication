import { Request, Response } from "express";
import { fetchAge, getJobStatus } from "../services/ageService";
import { handleResponse } from "../utils/responseHandler";
import { validateAgeQuery } from "../validation/age";

export const getAge = async (req: Request, res: Response) => {
  await handleResponse(
    {
      handler: fetchAge,
      validationFn: validateAgeQuery,
      validationData: req.query,
      handlerParams: [
        req.query.dob,
        req.query.mode,
        req.query.callbackUrl,
        req.query.jobId,
      ],
      successMessage: "Age calculation started!",
    },
    req,
    res
  );
};

export const getAgeJob = async (req: Request, res: Response) => {
  await handleResponse(
    {
      handler: getJobStatus,
      handlerParams: [req.params.jobId],
      successMessage: "Job status retrieved!",
    },
    req,
    res
  );
};
