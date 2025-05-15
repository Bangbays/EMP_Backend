import { Router, RequestHandler } from "express";
import { validate } from "../middleware/validate";
import { useReferral } from "../controller/referral.controller";
import { useReferralSchema } from "../schema/referral.schema";

const router = Router();
router.post("/use", validate(useReferralSchema), useReferral as unknown as RequestHandler);

export default router;
