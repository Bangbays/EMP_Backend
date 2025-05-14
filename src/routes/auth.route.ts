import { Router } from "express";
import { register, login } from "../controller/auth.controller";
import { validate } from "../middleware/validate";
import { registerSchema, loginSchema } from "../schema/auth.schema";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);

export default router;
