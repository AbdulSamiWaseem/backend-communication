import { RequestHandler } from "express";
import { findSession } from "../repositories/sessionRepository";
import { findUserById } from "../repositories/userRepository";

const unauthorized = (message: string) => ({ code: 401, message });

export const authenticate: RequestHandler = (req, res, next) => {
  const match = (req.headers.authorization || "").match(/^Bearer\s+(.+)$/i);
  if (!match) {
    return res.status(401).json(unauthorized("Missing access token"));
  }

  const session = findSession(match[1]);
  if (!session) {
    return res.status(401).json(unauthorized("Invalid or expired access token"));
  }

  const user = findUserById(session.userId);
  if (!user) {
    return res.status(401).json(unauthorized("User no longer exists"));
  }

  const { password, ...authUser } = user;
  req.user = authUser;
  next();
};
