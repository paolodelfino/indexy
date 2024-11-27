import schemaBigPaint__DB from "@/schemas/schemaBigPaint__DB";
import schemaInspiration__DB from "@/schemas/schemaInspiration__DB";
import schemaUUID from "@/schemas/schemaUUID";
import { z } from "zod";

const schemaBigPaintInspirationRelations__DB = z.object({
  id: schemaUUID,
  big_paint_id: schemaBigPaint__DB.shape.id,
  inspiration_id: schemaInspiration__DB.shape.id,
});
export default schemaBigPaintInspirationRelations__DB;
