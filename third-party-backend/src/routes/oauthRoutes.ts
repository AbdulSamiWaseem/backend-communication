import { Router } from "express";
import {
  handleLogin,
  handleToken,
  handleUserInfo,
  showAuthorize,
} from "../controllers/oauthController";

const router = Router();

router.get("/authorize", showAuthorize);
router.post("/login", handleLogin);
router.post("/token", handleToken);
router.get("/userinfo", handleUserInfo);

export default router;
