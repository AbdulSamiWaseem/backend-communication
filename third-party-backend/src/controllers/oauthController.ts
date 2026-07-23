import { Request, Response } from "express";
import {
  exchangeCodeForToken,
  getUserInfoForToken,
  loginAndIssueCode,
  renderLoginPage,
} from "../services/oauthService";

export const showAuthorize = (req: Request, res: Response) => {
  const redirectUri = String(req.query.redirect_uri || "");

  if (!redirectUri) {
    return res.status(400).send("Missing redirect_uri");
  }
  console.log("[oauth] showAuthorize", redirectUri);

  return res
    .status(200)
    .type("html")
    .send(renderLoginPage({ redirectUri }));
};

export const handleLogin = (req: Request, res: Response) => {
  const email = String(req.body?.email || "");
  const password = String(req.body?.password || "");
  const redirectUri = String(req.query.redirect_uri || "");

  try {
    if (!redirectUri) {
      throw new Error("Missing redirect_uri");
    }

    const code = loginAndIssueCode(email, password, redirectUri);
    const url = new URL(redirectUri);
    url.searchParams.set("code", code);
    console.log(`[oauth] issued code for ${email}, redirecting to callback`);
    return res.redirect(url.toString());
  } catch (error: any) {
    return res
      .status(401)
      .type("html")
      .send(renderLoginPage({ redirectUri, error: error.message }));
  }
};

export const handleToken = (req: Request, res: Response) => {
  const code = String(req.body?.code || "");
  const redirectUri = String(req.body?.redirect_uri || "");

  try {
    const tokens = exchangeCodeForToken(code, redirectUri);
    console.log("[oauth] token exchange ok");
    return res.status(200).json(tokens);
  } catch (error: any) {
    return res.status(400).json({
      error: "invalid_grant",
      error_description: error.message,
    });
  }
};

export const handleUserInfo = (req: Request, res: Response) => {
  const header = req.headers.authorization || "";
  const match = header.match(/^Bearer\s+(.+)$/i);
  if (!match) {
    return res.status(401).json({
      error: "invalid_token",
      error_description: "Missing Bearer access token",
    });
  }

  try {
    const profile = getUserInfoForToken(match[1]);
    return res.status(200).json(profile);
  } catch (error: any) {
    return res.status(401).json({
      error: "invalid_token",
      error_description: error.message,
    });
  }
};
