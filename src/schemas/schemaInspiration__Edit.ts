import schemaBigPaint__DB from "@/schemas/schemaBigPaint__DB";
import schemaInspiration__DB from "@/schemas/schemaInspiration__DB";
import schemaResource__DB from "@/schemas/schemaResource__DB";
import { z } from "zod";

const schemaInspiration__Edit = z.object({
  date: schemaInspiration__DB.shape.date.optional(), // TODO: Add date range check
  related_big_paints_ids: z.array(schemaBigPaint__DB.shape.id).optional(),
  related_inspirations_ids: z.array(schemaInspiration__DB.shape.id).optional(),
  content: schemaInspiration__DB.shape.content.optional(), // TODO: Maybe remove trim
  resources: z
    .array(
      z.object({
        sha256: schemaResource__DB.shape.sha256,
        type: schemaResource__DB.shape.type,
        n: schemaResource__DB.shape.n,
        buff: z.instanceof(ArrayBuffer),
      }),
    ) // TODO: Utilizzare schemaInspiration__Create.shape.resources?
    .optional(), // TODO: Probabile che content e resources debbano o essere undefined entrambi oppure defined entrambi (magari mettili in un object insieme)
  highlight: schemaInspiration__DB.shape.highlight.optional(),
});
export default schemaInspiration__Edit;
