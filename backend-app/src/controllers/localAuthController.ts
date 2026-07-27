import { Request, Response } from "express";
import { getProfile, login } from "../services/localAuthService";
import { handleResponse } from "../utils/responseHandler";
import { validateLogin } from "../validation/auth";

export const loginUser = async (req: Request, res: Response) => {
  await handleResponse(
    {
      handler: login,
      validationFn: validateLogin,
      validationData: req.body,
      handlerParams: [req.body?.email, req.body?.password],
      successMessage: "Login successful",
    },
    req,
    res
  );
};

export const me = async (req: Request, res: Response) => {
  await handleResponse(
    {
      handler: getProfile,
      handlerParams: [req.user],
      successMessage: "Profile retrieved",
    },
    req,
    res
  );
};
