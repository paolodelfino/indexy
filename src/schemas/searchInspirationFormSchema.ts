import { idSchema } from "@/schemas/idSchema";
import { z } from "zod";

export const searchInspirationFormSchema = z
  .object({
    date: z
      .object({
        comparison: z.enum([">", "<", "=", ">=", "<="]),
        x1: z.date(),
      })
      .or(
        z
          .object({
            comparison: z.literal("between"),
            x1: z.date(),
            x2: z.date(),
          })
          .refine((value) => value.x1 < value.x2, "Invalid range"),
      )
      .optional(),
    content: z.string().trim().min(1).optional(),
    highlight: z.boolean().optional(),
    related_big_paints_ids: z.array(idSchema).min(1).optional(),
    related_inspirations_ids: z.array(idSchema).min(1).optional(),
    orderBy: z.enum(["date", "highlight", "content"]),
    orderByDir: z.enum(["desc", "asc"]),
  })
  .refine(
    (value) => Object.entries(value).length > 2, // Update accordingly with above props
    "A predicate must be provided",
  );
