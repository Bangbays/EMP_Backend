import { Router } from "express";
import {
  listEvents,
  getEvent,
  createEvent,
} from "../controllers/eventController";
import { authenticate } from "../middlewares/authMiddleware";

const router = Router();
router.get("/", listEvents);
router.get("/:id", getEvent);
router.post("/", authenticate, createEvent);

export default router;
