import schemaBigPaint__DB from "@/schemas/schemaBigPaint__DB";
import { z } from "zod";

export default z.object({
  name: schemaBigPaint__DB.shape.name.optional(),
  date: schemaBigPaint__DB.shape.date.optional(), // TODO: Add date range check
  related_big_paints_ids:
    schemaBigPaint__DB.shape.related_big_paints_ids.optional(),
});
