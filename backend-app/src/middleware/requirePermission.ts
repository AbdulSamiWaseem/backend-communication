import { RequestHandler } from "express";
import { Permission } from "../domain/permission";

export const requirePermission =
  (...required: Permission[]): RequestHandler =>
  (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ code: 401, message: "Not authenticated" });
    }

    const hasAll = required.every((p) => req.user!.permissions.includes(p));
    if (!hasAll) {
      return res.status(403).json({
        code: 403,
        message: "You do not have permission to access this resource",
      });
    }

    next();
  };
