import { z } from "zod";

export const useReferralSchema = z.object({
  referralCode: z.string().min(3),
});
