import { randomUUID } from "crypto";

type Session = {
  userId: string;
  expiresAt: number;
};

const TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

const sessions = new Map<string, Session>();

export const createSession = (
  userId: string
): { access_token: string; expires_in: number } => {
  const token = randomUUID();
  sessions.set(token, { userId, expiresAt: Date.now() + TOKEN_TTL_MS });

  return {
    access_token: token,
    expires_in: Math.floor(TOKEN_TTL_MS / 1000),
  };
};

export const findSession = (token: string): Session | undefined => {
  const session = sessions.get(token);
  if (!session) return undefined;

  if (session.expiresAt < Date.now()) {
    sessions.delete(token);
    return undefined;
  }

  return session;
};
