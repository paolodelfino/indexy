import schemaInspiration__DB from "@/schemas/schemaInspiration__DB";
import schemaResource__DB from "@/schemas/schemaResource__DB";
import { z } from "zod";

// TODO: Extend this form
const schemaInspiration__Create = z.object({
  content: schemaInspiration__DB.shape.content,
  resources: z.array(
    z.object({
      sha256: schemaResource__DB.shape.sha256,
      type: schemaResource__DB.shape.type,
      n: schemaResource__DB.shape.n,
      buff: z.instanceof(ArrayBuffer),
    }),
  ),
});
export default schemaInspiration__Create;
