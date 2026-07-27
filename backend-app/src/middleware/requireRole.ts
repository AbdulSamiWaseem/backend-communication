import { RequestHandler } from "express";
import { Role } from "../domain/role";

export const requireRole =
  (...roles: Role[]): RequestHandler =>
    (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({ code: 401, message: "Not authenticated" });
      }

      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          code: 403,
          message: "You do not have permission to access this resource",
        });
      }

      next();
    };
