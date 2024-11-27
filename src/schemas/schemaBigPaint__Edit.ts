import schemaBigPaint__DB from "@/schemas/schemaBigPaint__DB";
import schemaInspiration__DB from "@/schemas/schemaInspiration__DB";
import { z } from "zod";

export default z.object({
  name: schemaBigPaint__DB.shape.name.optional(),
  date: schemaBigPaint__DB.shape.date.optional(), // TODO: Add date range check
  related_big_paints_ids: z.array(schemaBigPaint__DB.shape.id).optional(),
  related_inspirations_ids: z.array(schemaInspiration__DB.shape.id).optional(),
});
