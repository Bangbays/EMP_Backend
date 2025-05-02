import { Router } from "express";
import { applyOrganizer, getStatus } from "../controllers/organizerController";

const router = Router();
router.post("/apply", applyOrganizer);
router.post("/status", getStatus);
export default router;
