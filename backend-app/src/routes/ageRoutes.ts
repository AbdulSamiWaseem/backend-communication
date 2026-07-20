import { Router } from "express";
import { getAge, receiveAgeCallback } from "../controllers/ageController";

const router = Router();

router.get("/age", getAge);
router.post("/callbacks/age/:jobId", receiveAgeCallback);

export default router;
