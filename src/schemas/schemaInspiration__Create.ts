import schemaResource from "@/schemas/schemaResource";
import { z } from "zod";

// TODO: Extend this form
export default z.object({
  content: z.string().trim().min(1),
  resources: z.array(
    z.object({
      sha256: schemaResource.shape.sha256,
      type: schemaResource.shape.type,
      n: schemaResource.shape.n,
      buff: z.instanceof(ArrayBuffer),
    }),
  ),
});
