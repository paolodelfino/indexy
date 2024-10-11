import { idSchema } from "@/schemas/idSchema";
import { z } from "zod";

export const editInspirationFormSchema = z.object({
  date: z.date().optional(), // TODO: Add date range check
  related_big_paints_ids: z.array(idSchema).optional(),
  content: z.string().trim().min(1).optional(),
  highlight: z.boolean().optional(),
  related_inspirations_ids: z.array(idSchema).optional(),
});
