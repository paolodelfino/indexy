import schemaBigPaint__DB from "@/schemas/schemaBigPaint__DB";
import schemaUUID from "@/schemas/schemaUUID";
import { z } from "zod";

const schemaBigPaintRelations = z.object({
  id: schemaUUID,
  big_paint1_id: schemaBigPaint__DB.shape.id,
  big_paint2_id: schemaBigPaint__DB.shape.id,
});
export default schemaBigPaintRelations;
