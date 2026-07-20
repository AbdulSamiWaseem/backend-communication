import { Request, Response } from "express";
import { acceptAgeCallback, fetchAge } from "../services/ageService";
import { handleResponse } from "../utils/responseHandler";
import { validateAgeCallback, validateAgeQuery } from "../validation/age";

export const getAge = async (req: Request, res: Response) => {
  await handleResponse(
    {
      handler: fetchAge,
      validationFn: validateAgeQuery,
      validationData: req.query,
      handlerParams: [req.query.dob, req.query.mode],
      successMessage: "Age retrieved successfully!",
    },
    req,
    res
  );
};

export const receiveAgeCallback = async (req: Request, res: Response) => {
  await handleResponse(
    {
      handler: acceptAgeCallback,
      validationFn: validateAgeCallback,
      validationData: { ...req.body, jobId: req.params.jobId },
      handlerParams: [req.params.jobId, req.body?.dob, req.body?.age],
      successMessage: "Callback received",
    },
    req,
    res
  );
};
