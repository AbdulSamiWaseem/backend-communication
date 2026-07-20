import { Request, Response } from "express";
import { resolveCallback } from "../dal/ageDal";
import { fetchAge } from "../services/ageService";
import { handleResponse } from "../utils/responseHandler";
import { validateAgeQuery } from "../validation/age";

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
  const { jobId } = req.params;
  const { dob, age } = req.body || {};

  if (typeof age !== "number" || !dob) {
    return res.status(400).json({
      code: 400,
      message: "Body must include dob and age",
    });
  }

  const ok = resolveCallback({ jobId, dob: String(dob), age });
  if (!ok) {
    return res.status(404).json({
      code: 404,
      message: `No pending request for job ${jobId}`,
    });
  }

  return res.status(200).json({
    code: 200,
    message: "Callback received",
  });
};
