import { Request, Response } from "express";
import {
  exchangeCodeForToken,
  getUserInfoForToken,
  issueCodeForUserId,
  loginAndIssueCode,
  renderAuthorizePage,
  renderLoginPage,
} from "../services/oauthService";

const OAUTH_USER_COOKIE = "oauth_user";

const redirectWithCode = (res: Response, redirectUri: string, code: string) => {
  const url = new URL(redirectUri);
  url.searchParams.set("code", code);
  return res.redirect(url.toString());
};

export const showAuthorize = (req: Request, res: Response) => {
  const redirectUri = String(req.query.redirect_uri || "");

  if (!redirectUri) {
    return res.status(400).send("Missing redirect_uri");
  }

  const userId = req.signedCookies?.[OAUTH_USER_COOKIE];
  return res
    .status(200)
    .type("html")
    .send(renderAuthorizePage(redirectUri, userId));
};

export const handleLogin = (req: Request, res: Response) => {
  const email = String(req.body?.email || "");
  const password = String(req.body?.password || "");
  const redirectUri = String(req.query.redirect_uri || "");

  try {
    if (!redirectUri) {
      throw new Error("Missing redirect_uri");
    }

    const { code, userId } = loginAndIssueCode(email, password, redirectUri);
    res.cookie(OAUTH_USER_COOKIE, userId, { signed: true });
    console.log(`[oauth] issued code for ${email}, redirecting to callback`);
    return redirectWithCode(res, redirectUri, code);
  } catch (error: any) {
    return res
      .status(401)
      .type("html")
      .send(renderLoginPage({ redirectUri, error: error.message }));
  }
};

export const handleConfirm = (req: Request, res: Response) => {
  const redirectUri = String(req.query.redirect_uri || "");
  const userId = req.signedCookies?.[OAUTH_USER_COOKIE];

  try {
    if (!redirectUri) {
      throw new Error("Missing redirect_uri");
    }
    if (!userId) {
      throw new Error("Not signed in");
    }

    const code = issueCodeForUserId(String(userId), redirectUri);
    console.log("[oauth] confirm allowed, redirecting with code");
    return redirectWithCode(res, redirectUri, code);
  } catch (error: any) {
    res.clearCookie(OAUTH_USER_COOKIE);
    return res
      .status(401)
      .type("html")
      .send(renderLoginPage({ redirectUri, error: error.message }));
  }
};

export const handleSwitch = (req: Request, res: Response) => {
  const redirectUri = String(req.query.redirect_uri || "");
  res.clearCookie(OAUTH_USER_COOKIE);

  if (!redirectUri) {
    return res.status(400).send("Missing redirect_uri");
  }

  return res.status(200).type("html").send(renderLoginPage({ redirectUri }));
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
