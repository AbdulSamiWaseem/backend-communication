import { Request, Response } from "express";
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
