import { Request, Response } from "express";
import { getOverview } from "../services/adminService";
import { handleResponse } from "../utils/responseHandler";

export const getAdminOverview = async (req: Request, res: Response) => {
  await handleResponse(
    {
      handler: getOverview,
      handlerParams: [],
      successMessage: "Admin overview retrieved",
    },
    req,
    res
  );
};
