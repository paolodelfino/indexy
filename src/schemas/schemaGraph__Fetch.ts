import schemaBigPaint__DB from "@/schemas/schemaBigPaint__DB";
import schemaInspiration__DB from "@/schemas/schemaInspiration__DB";
import { z } from "zod";

const schemaGraph__Fetch = z
  .object({
    show: z.enum(["inspiration_only", "big_paint_only"]).optional(),
    depth: z.number().int().gte(0), // TODO: Magari dovremmo farlo 1-based
  })
  .and(
    z
      .object({
        type: z.literal("big_paint"),
        id: schemaBigPaint__DB.shape.id,
      })
      .or(
        z.object({
          type: z.literal("inspiration"),
          id: schemaInspiration__DB.shape.id,
        }),
      ),
  );
export default schemaGraph__Fetch;
