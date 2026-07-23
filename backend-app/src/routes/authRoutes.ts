import { Router } from "express";
import {
  googleAuthCallback,
  providerAuthCallback,
  startGoogleAuth,
  startProviderAuth,
} from "../controllers/authController";

const router = Router();

router.get("/auth/google", startGoogleAuth);
router.get("/auth/google/callback", googleAuthCallback);
router.get("/auth/provider", startProviderAuth);
router.get("/auth/provider/callback", providerAuthCallback);

export default router;
