import { z } from "zod";

export const createBigPaintFormSchema = z.object({
  name: z.string().trim().min(1),
});
