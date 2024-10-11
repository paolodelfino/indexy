import { idSchema } from "@/schemas/idSchema";
import { z } from "zod";

export const searchBigPaintFormSchema = z
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
    name: z.string().trim().min(1).optional(),
    related_big_paints_ids: z.array(idSchema).min(1).optional(),
    orderBy: z.enum(["date", "name"]),
    orderByDir: z.enum(["desc", "asc"]),
  })
  .refine(
    (value) => Object.entries(value).length > 2, // Update accordingly with above props
    "A predicate must be provided",
  );
