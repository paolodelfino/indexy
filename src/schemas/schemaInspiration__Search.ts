import schemaId__InspirationBigPaint from "@/schemas/schemaId__InspirationBigPaint";
import { z } from "zod";

export default z
  .object({
    date: z
      .object({
        comparison: z.enum([">", "<", "=", ">=", "<="]),
        date: z.date(),
      })
      .or(
        z
          .object({
            comparison: z.literal("between"),
            date: z.date(),
            date2: z.date(),
          })
          .refine((value) => value.date < value.date2, "Invalid range"),
      )
      .optional(),
    content: z.string().trim().min(1).optional(),
    highlight: z.boolean().optional(),
    related_big_paints_ids: z
      .array(schemaId__InspirationBigPaint)
      .min(1)
      .optional(),
    related_inspirations_ids: z
      .array(schemaId__InspirationBigPaint)
      .min(1)
      .optional(),
    orderBy: z.enum(["date", "highlight", "content"]),
    orderByDir: z.enum(["desc", "asc"]),
  })
  .refine(
    (value) =>
      Object.entries(value).filter((entry) => entry[1] !== undefined).length >
      2, // Update accordingly with above props
    "A predicate must be provided",
  );
