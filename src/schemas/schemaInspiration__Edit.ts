import schemaId__InspirationBigPaint from "@/schemas/schemaId__InspirationBigPaint";
import { z } from "zod";

export default z.object({
  date: z.date().optional(), // TODO: Add date range check
  related_big_paints_ids: z.array(schemaId__InspirationBigPaint).optional(),
  content: z.string().trim().min(1).optional(), // TODO: Maybe remove trim
  highlight: z.boolean().optional(),
  related_inspirations_ids: z.array(schemaId__InspirationBigPaint).optional(),
});
