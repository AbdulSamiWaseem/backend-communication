import { RequestHandler, Router } from "express";
import { Permission } from "../domain/permission";
import { authenticate } from "../middleware/authenticate";
import { requirePermission } from "../middleware/requirePermission";

type Access = "public" | Permission[];

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

  if (access === "public") {
    router[method](path, handler);
    return;
  }

  authChain.push(authenticate);

  if (Array.isArray(access) && access.length > 0) {
    authChain.push(requirePermission(...access));
  }

  router[method](path, ...authChain, handler);
};
