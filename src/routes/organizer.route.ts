import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";
import {
  getDashboard,
  getTransaction,
  acceptTransaction,
  rejectTransaction,
  getAttendees,
} from "../controller/organizer.controller";

const router = Router();
router.use("/", authenticate, authorize(["ORGANIZER"]));

router.get("/dashboard", getDashboard);
router.get("/transactions", getTransaction);
router.patch("/transactions/:id/accept", acceptTransaction);
router.patch("/transactions/:id/reject", rejectTransaction);
router.get("/events/:id/attendees", getAttendees);

export default router;
