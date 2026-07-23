import { randomUUID } from "crypto";
import { OAuthUser } from "../domain/oauthUser";

type AuthCode = {
  userId: string;
  redirectUri: string;
  expiresAt: number;
};

type AccessToken = {
  userId: string;
  expiresAt: number;
};

const CODE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const ACCESS_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

const users: OAuthUser[] = [
  {
    id: "1",
    email: "sami@yopmail.com",
    password: "123456",
    name: "Sami",
  },
];

const authCodes = new Map<string, AuthCode>();
const accessTokens = new Map<string, AccessToken>();

export const findUserByEmail = (email: string): OAuthUser | undefined =>
  users.find((u) => u.email.toLowerCase() === email.toLowerCase());

export const findUserById = (id: string): OAuthUser | undefined =>
  users.find((u) => u.id === id);

export const createAuthCode = (userId: string, redirectUri: string): string => {
  const code = randomUUID();
  authCodes.set(code, {
    userId,
    redirectUri,
    expiresAt: Date.now() + CODE_TTL_MS,
  });
  return code;
};

export const consumeAuthCode = (
  code: string,
  redirectUri: string
): AuthCode | undefined => {
  const entry = authCodes.get(code);
  if (!entry) return undefined;

  authCodes.delete(code);

  if (entry.expiresAt < Date.now()) return undefined;
  if (entry.redirectUri !== redirectUri) return undefined;

  return entry;
};

export const createAccessToken = (userId: string): {
  access_token: string;
  expires_in: number;
} => {
  const token = randomUUID();
  const expiresInSec = Math.floor(ACCESS_TOKEN_TTL_MS / 1000);
  accessTokens.set(token, {
    userId,
    expiresAt: Date.now() + ACCESS_TOKEN_TTL_MS,
  });
  return { access_token: token, expires_in: expiresInSec };
};

export const findAccessToken = (token: string): AccessToken | undefined => {
  const entry = accessTokens.get(token);
  if (!entry) return undefined;
  if (entry.expiresAt < Date.now()) {
    accessTokens.delete(token);
    return undefined;
  }
  return entry;
};
