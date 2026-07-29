import { RequestHandler } from "express";
import { Permission } from "../domain/permission";

export type AccessRule = {
  and?: Permission[];
  or?: Permission[];
};

export const matchesAccessRule = (
  permissions: Permission[],
  rule: AccessRule
) => {
  const andOk =
    !rule.and?.length || rule.and.every((p) => permissions.includes(p));
  const orOk =
    !rule.or?.length || rule.or.some((p) => permissions.includes(p));
  return andOk && orOk;
};

export const requirePermission =
  (rule: AccessRule): RequestHandler =>
  (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ code: 401, message: "Not authenticated" });
    }

    if (!matchesAccessRule(req.user.permissions, rule)) {
      return res.status(403).json({
        code: 403,
        message: "You do not have permission to access this resource",
      });
    }

    next();
  };
