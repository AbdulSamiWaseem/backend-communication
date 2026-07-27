import { RequestHandler, Router } from "express";
import { Role } from "../domain/role";
import { authenticate } from "../middleware/authenticate";
import { requireRole } from "../middleware/requireRole";

type Access = "public" | Role[];

type RouteConfig = {
  router: Router;
  method: "get" | "post" | "put" | "patch" | "delete";
  path: string;
  handler: RequestHandler;
  access?: Access;
};

export const registerRoute = ({
  router,
  method,
  path,
  handler,
  access,
}: RouteConfig) => {
  const authChain: RequestHandler[] = [];

  if (access !== "public") {
    authChain.push(authenticate);
    if (Array.isArray(access)) {
      authChain.push(requireRole(...access));
    }
  }

  router[method](path, ...authChain, handler);
};
