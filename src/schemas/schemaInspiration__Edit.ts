import schemaId__InspirationBigPaint from "@/schemas/schemaId__InspirationBigPaint";
import { z } from "zod";

export default z.object({
  date: z.date().optional(), // TODO: Add date range check
  related_big_paints_ids: z.array(schemaId__InspirationBigPaint).optional(),
  content: z.string().trim().min(1).optional(), // TODO: Maybe remove trim
  resources: z
    .array(
      z.object({
        sha256: z
          .string()
          .trim()
          .regex(/^[a-f0-9]{64}$/i, "Invalid SHA-256 hash"),
        type: z.enum(["image", "binary"]),
        n: z.number().gt(0),
        buff: z.instanceof(ArrayBuffer),
      }),
    )
    .optional(), // TODO: Probabile che content e resources debbano o essere undefined entrambi oppure defined entrambi
  highlight: z.boolean().optional(),
  related_inspirations_ids: z.array(schemaId__InspirationBigPaint).optional(),
});
