import { z } from "zod";

export const createInspirationFormSchema = z.object({
  content: z.string().trim().min(1),
});
