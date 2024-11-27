import schemaBigPaint__DB from "@/schemas/schemaBigPaint__DB";
import schemaInspiration__DB from "@/schemas/schemaInspiration__DB";
import { z } from "zod";

const schemaBigPaint__Query = z
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
    name: z.string().trim().min(1).optional(),
    related_big_paints_ids: z
      .array(schemaBigPaint__DB.shape.id)
      .min(1)
      .optional(),
    related_inspirations_ids: z
      .array(schemaInspiration__DB.shape.id)
      .min(1)
      .optional(),
    orderBy: z.enum(["date", "name"]),
    orderByDir: z.enum(["desc", "asc"]),
  })
  .refine(
    (value) =>
      Object.entries(value).filter((entry) => entry[1] !== undefined).length >
      2, // Update accordingly with above props
    "A predicate must be provided",
  );
export default schemaBigPaint__Query;
