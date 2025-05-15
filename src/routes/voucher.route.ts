import { Router } from "express";
import { getPoints } from "../controller/voucher.controller";
import { getCoupons } from "../controller/voucher.controller";

const router = Router();
router.get("/points", getPoints);
router.get("/coupons", getCoupons);

export default router;
