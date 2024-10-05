import { dateSchema } from "@/schemas/dateSchema";
import { z } from "zod";

export const editInspirationSchema = z.object({
  date: dateSchema.optional(),
  related_big_paints_ids: z.array(z.string().trim().length(36)).optional(),
  content: z.string().trim().min(1).optional(),
  highlight: z.boolean().optional(),
  related_inspirations_ids: z.array(z.string().trim().length(36)).optional(),
});
