import schemaResource from "@/schemas/schemaResource";
import schemaUUID from "@/schemas/schemaUUID";
import { z } from "zod";

export default z.object({
  date: z.date().optional(), // TODO: Add date range check
  related_big_paints_ids: z.array(schemaUUID).optional(),
  content: z.string().trim().min(1).optional(), // TODO: Maybe remove trim
  resources: z
    .array(
      z.object({
        sha256: schemaResource.shape.sha256,
        type: schemaResource.shape.type,
        n: schemaResource.shape.n,
        buff: z.instanceof(ArrayBuffer),
      }),
    )
    .optional(), // TODO: Probabile che content e resources debbano o essere undefined entrambi oppure defined entrambi
  highlight: z.boolean().optional(),
  related_inspirations_ids: z.array(schemaUUID).optional(),
});
