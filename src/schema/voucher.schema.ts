import { z } from "zod";

export const useCouponSchema = z.object({
  code: z.string().min(5),
});
