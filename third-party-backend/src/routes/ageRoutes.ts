import { Router } from "express";
import { getAge } from "../controllers/ageController";

const router = Router();

router.get("/", getAge);

export default router;
