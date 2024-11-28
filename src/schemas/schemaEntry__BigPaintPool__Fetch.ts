import schemaBigPaint__DB from "@/schemas/schemaBigPaint__DB";
import schemaInspiration__DB from "@/schemas/schemaInspiration__DB";
import { z } from "zod";

const schemaEntry__BigPaintPool__Fetch = z
  .object({
    type: z.literal("big_paint"),
    id: schemaBigPaint__DB.shape.id,
  })
  .or(
    z.object({
      type: z.literal("inspiration"),
      id: schemaInspiration__DB.shape.id,
    }),
  );
export default schemaEntry__BigPaintPool__Fetch;
