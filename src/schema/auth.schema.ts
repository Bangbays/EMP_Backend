import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
  isOrganizer: z.boolean().optional().default(false),
  referralCode: z.string().optional(),
  orgName: z.string().min(3).optional(),
  orgDetail: z.string().min(10).optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
