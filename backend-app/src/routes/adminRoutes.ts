import { Router } from "express";
import { getAdminOverview } from "../controllers/adminController";
import { registerRoute } from "../utils/registerRoute";

const router = Router();

registerRoute({
  router,
  method: "get",
  path: "/overview",
  access: { and: ["admin"] },
  handler: getAdminOverview,
});

export default router;
