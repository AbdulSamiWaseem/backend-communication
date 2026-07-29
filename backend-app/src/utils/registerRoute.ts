import { RequestHandler, Router } from "express";
import { authenticate } from "../middleware/authenticate";
import {
  AccessRule,
  requirePermission,
} from "../middleware/requirePermission";

type Access = "public" | AccessRule;

type RouteConfig = {
  router: Router;
  method: "get" | "post" | "put" | "patch" | "delete";
  path: string;
  handler: RequestHandler;
  access?: Access;
};

const hasAccessRule = (access: AccessRule) =>
  Boolean(access.and?.length || access.or?.length);

export const registerRoute = ({
  router,
  method,
  path,
  handler,
  access,
}: RouteConfig) => {
  if (access === "public") {
    router[method](path, handler);
    return;
  }

  const authChain: RequestHandler[] = [authenticate];

  if (access && hasAccessRule(access)) {
    authChain.push(requirePermission(access));
  }

  router[method](path, ...authChain, handler);
};
