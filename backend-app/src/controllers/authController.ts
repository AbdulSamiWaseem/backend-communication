import { Request, Response } from "express";
import {
  getGoogleAuthUrl,
  getProviderAuthUrl,
  handleGoogleCallback,
  handleProviderCallback,
} from "../services/authService";
import { handleResponse } from "../utils/responseHandler";

export const startGoogleAuth = async (_req: Request, res: Response) => {
  try {
    const url = getGoogleAuthUrl();
    console.log("[oauth] redirecting to Google");
    return res.redirect(url);
  } catch (error: any) {
    console.error("[oauth] failed to start Google auth:", error.message);
    return res.status(500).json({
      code: 500,
      message: error.message || "Failed to start Google OAuth",
    });
  }
};

export const googleAuthCallback = async (req: Request, res: Response) => {
  await handleResponse(
    {
      handler: handleGoogleCallback,
      handlerParams: [req.query.code, req.query.error],
      successMessage: "Google OAuth callback handled",
    },
    req,
    res
  );
};

export const startProviderAuth = async (_req: Request, res: Response) => {
  try {
    const url = getProviderAuthUrl();
    console.log("[oauth] redirecting to third-party provider");
    return res.redirect(url);
  } catch (error: any) {
    console.error("[oauth] failed to start provider auth:", error.message);
    return res.status(500).json({
      code: 500,
      message: error.message || "Failed to start provider OAuth",
    });
  }
};

export const providerAuthCallback = async (req: Request, res: Response) => {
  await handleResponse(
    {
      handler: handleProviderCallback,
      handlerParams: [req.query.code],
      successMessage: "Provider OAuth callback handled",
    },
    req,
    res
  );
};
