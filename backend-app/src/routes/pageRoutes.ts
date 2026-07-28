import { Router } from "express";
import {
  getAbout,
  getContacts,
  getReports,
  getSettings,
} from "../controllers/pageController";
import { registerRoute } from "../utils/registerRoute";

const router = Router();

registerRoute({
  router,
  method: "get",
  path: "/about",
  access: ["about"],
  handler: getAbout,
});

registerRoute({
  router,
  method: "get",
  path: "/contacts",
  access: ["contacts"],
  handler: getContacts,
});

registerRoute({
  router,
  method: "get",
  path: "/reports",
  access: ["reports"],
  handler: getReports,
});

registerRoute({
  router,
  method: "get",
  path: "/settings",
  access: ["settings"],
  handler: getSettings,
});

export default router;
