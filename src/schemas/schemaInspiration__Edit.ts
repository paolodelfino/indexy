import schemaInspiration__DB from "@/schemas/schemaInspiration__DB";
import schemaResource__DB from "@/schemas/schemaResource__DB";
import { z } from "zod";

export default z.object({
  date: schemaInspiration__DB.shape.date.optional(), // TODO: Add date range check
  related_big_paints_ids:
    schemaInspiration__DB.shape.related_big_paints_ids.optional(),
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
    .optional(), // TODO: Probabile che content e resources debbano o essere undefined entrambi oppure defined entrambi
  highlight: schemaInspiration__DB.shape.highlight.optional(),
  related_inspirations_ids:
    schemaInspiration__DB.shape.related_inspirations_ids.optional(),
});
