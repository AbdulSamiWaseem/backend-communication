import { Request, Response } from "express";
import { getPage } from "../services/pageService";
import { handleResponse } from "../utils/responseHandler";

export const getAbout = async (req: Request, res: Response) => {
  await handleResponse(
    {
      handler: getPage,
      handlerParams: ["about"],
      successMessage: "about retrieved",
    },
    req,
    res
  );
};

export const getContacts = async (req: Request, res: Response) => {
  await handleResponse(
    {
      handler: getPage,
      handlerParams: ["contacts"],
      successMessage: "contacts retrieved",
    },
    req,
    res
  );
};

export const getReports = async (req: Request, res: Response) => {
  await handleResponse(
    {
      handler: getPage,
      handlerParams: ["reports"],
      successMessage: "reports retrieved",
    },
    req,
    res
  );
};

export const getSettings = async (req: Request, res: Response) => {
  await handleResponse(
    {
      handler: getPage,
      handlerParams: ["settings"],
      successMessage: "settings retrieved",
    },
    req,
    res
  );
};
