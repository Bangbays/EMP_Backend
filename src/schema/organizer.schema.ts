import { z } from "zod";

export const dashboardSchema = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
  groupBy: z.enum(["day", "month", "year"]).default("month"),
});
