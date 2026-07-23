import {
  exchangeCodeForTokens,
  fetchGoogleUserInfo,
  getGoogleAuthUrl,
} from "../clients/googleOAuthClient";
import {
  exchangeProviderCodeForTokens,
  fetchProviderUserInfo,
  getProviderAuthUrl,
} from "../clients/providerOAuthClient";
import { ResponseObject } from "../utils/constants";

export { getGoogleAuthUrl, getProviderAuthUrl };

export const handleGoogleCallback = async (
  code: string | undefined,
  oauthError: string | undefined,
  resp: ResponseObject
) => {
  if (oauthError) {
    console.error("[oauth] Google returned error:", oauthError);
    return {
      error: true,
      error_message: `Google OAuth denied or failed: ${oauthError}`,
    };
  }

  if (!code) {
    return {
      error: true,
      error_message:
        "Missing authorization code. Open /api/auth/google (do not hit callback directly).",
    };
  }

  try {
    const tokens = await exchangeCodeForTokens(code);
    console.log("[oauth] Google token exchange result:", tokens);

    const profile = await fetchGoogleUserInfo(tokens);
    console.log("[oauth] Google userinfo:", profile);

    return {
      ...resp,
      success_message: "Google OAuth callback handled",
      data: {
        tokens,
        profile,
      },
    };
  } catch (error: any) {
    const details = error.response?.data || error.message;
    console.error("[oauth] Google callback failed:", details);
    return {
      error: true,
      error_message:
        typeof details === "string"
          ? details
          : details?.error_description ||
            details?.error ||
            "Google OAuth token exchange failed",
    };
  }
};

export const handleProviderCallback = async (
  code: string | undefined,
  resp: ResponseObject
) => {
  if (!code) {
    return {
      error: true,
      error_message:
        "Missing authorization code. Open /api/auth/provider (do not hit callback directly).",
    };
  }

  try {
    const tokens = await exchangeProviderCodeForTokens(code);
    console.log("[oauth] provider token exchange result:", tokens);

    const profile = await fetchProviderUserInfo(tokens.access_token);
    console.log("[oauth] provider userinfo:", profile);

    return {
      ...resp,
      success_message: "Provider OAuth callback handled",
      data: {
        tokens,
        profile,
      },
    };
  } catch (error: any) {
    const details = error.response?.data || error.message;
    console.error("[oauth] provider callback failed:", details);
    return {
      error: true,
      error_message:
        typeof details === "string"
          ? details
          : details?.error_description ||
            details?.error ||
            "Provider OAuth token exchange failed",
    };
  }
};
