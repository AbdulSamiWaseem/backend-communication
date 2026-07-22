import { Router } from "express";
import {
  googleAuthCallback,
  startGoogleAuth,
} from "../controllers/authController";

const router = Router();

router.get("/auth/google", startGoogleAuth);
router.get("/auth/google/callback", googleAuthCallback);

export default router;
