import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().min(3).optional(),
  bio: z.string().max(255).optional(),
});

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(6),
  newPassword: z.string().min(6),
});

export const resetPasswordRequestSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(10),
  newPassword: z.string().min(6),
});
