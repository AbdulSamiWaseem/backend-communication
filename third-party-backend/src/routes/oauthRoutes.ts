import { Router } from "express";
import {
  handleConfirm,
  handleLogin,
  handleSwitch,
  handleToken,
  handleUserInfo,
  showAuthorize,
} from "../controllers/oauthController";

const router = Router();

router.get("/authorize", showAuthorize);
router.post("/login", handleLogin);
router.post("/confirm", handleConfirm);
router.post("/switch", handleSwitch);
router.post("/token", handleToken);
router.get("/userinfo", handleUserInfo);

export default router;
