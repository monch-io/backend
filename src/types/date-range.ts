import { z } from "zod";

export const DateRange = z.object({
  from: z.date(),
  to: z.date(),
});
export interface DateRange extends z.infer<typeof DateRange> {}
