import { z } from "zod";

export const editInspirationSchema = z.object({
  date: z.date().optional(), // TODO: Add date range check
  related_big_paints_ids: z.array(z.string().trim().length(36)).optional(),
  content: z.string().trim().min(1).optional(),
  highlight: z.boolean().optional(),
  related_inspirations_ids: z.array(z.string().trim().length(36)).optional(),
});
