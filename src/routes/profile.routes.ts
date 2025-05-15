import { Router } from "express";
import { validate } from "../middleware/validate";
import {
  updateProfileSchema,
  changePasswordSchema,
  resetPasswordRequestSchema,
  resetPasswordSchema,
} from "../schema/profile.schema";
import {
  updateProfile,
  changePassword,
  requestResetPassword,
  resetPassword,
} from "../controller/profile.controller";
import { uploadAvatar } from "../utils/upload";

const router = Router();

// update profil + upload avatar
router.put(
  "/profile",
  uploadAvatar,
  validate(updateProfileSchema),
  updateProfile
);

// ganti password(harus login)
router.put(
  "/auth/change-password",
  validate(changePasswordSchema),
  changePassword
);

// minta reset password
router.post(
  "/auth/reset-password-request",
  validate(resetPasswordRequestSchema),
  requestResetPassword
);

// reset password via token
router.post(
  "/auth/reset-password",
  validate(resetPasswordSchema),
  resetPassword
);

export default router;
