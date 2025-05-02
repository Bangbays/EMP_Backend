import { Router } from "express";
import {
  checkout,
  uploadProof,
  getTransaction,
} from "../controllers/transactionController";

const router = Router();
router.post("/checkout", checkout);
router.post("/:id/upload-proof", uploadProof);
router.get("/:id", getTransaction);

export default router;
