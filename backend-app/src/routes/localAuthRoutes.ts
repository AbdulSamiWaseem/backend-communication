import { Router } from "express";
import { loginUser, me } from "../controllers/localAuthController";
import { registerRoute } from "../utils/registerRoute";

const router = Router();

registerRoute({
  router,
  method: "post",
  path: "/auth/login",
  access: "public",
  handler: loginUser,
});

registerRoute({
  router,
  method: "get",
  path: "/auth/me",
  handler: me,
});

export default router;
