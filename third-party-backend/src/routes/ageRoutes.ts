import { Router } from "express";
import { getAge, getAgeJob } from "../controllers/ageController";

const router = Router();

// Static /jobs path before any future /:id catch-all
router.get("/jobs/:jobId", getAgeJob);
router.get("/", getAge);

export default router;
