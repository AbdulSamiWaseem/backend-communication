import { Credentials } from "google-auth-library";
import { google } from "googleapis";

const getOAuth2Client = () => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error(
      "Missing GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, or GOOGLE_REDIRECT_URI"
    );
  }

  return new google.auth.OAuth2(clientId, clientSecret, redirectUri);
};

/** Docs-style: oauth2Client.generateAuthUrl(...) */
export const getGoogleAuthUrl = (): string => {
  const oauth2Client = getOAuth2Client();

  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["openid", "email", "profile"],
    prompt: "consent",
  });
};

/** Docs-style: oauth2Client.getToken(code) */
export const exchangeCodeForTokens = async (
  code: string
): Promise<Credentials> => {
  const oauth2Client = getOAuth2Client();
  const { tokens } = await oauth2Client.getToken(code);

  if (!tokens.access_token) {
    throw new Error("Google did not return an access_token");
  }

  return tokens;
};

/** Docs-style: google.oauth2 + userinfo.get() with setCredentials */
export const fetchGoogleUserInfo = async (tokens: Credentials) => {
  const oauth2Client = getOAuth2Client();
  oauth2Client.setCredentials(tokens);

  const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
  const { data } = await oauth2.userinfo.get();
  return data;
};
