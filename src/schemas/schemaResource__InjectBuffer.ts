import schemaResource from "@/schemas/schemaResource";
import { z } from "zod";

const schemaResource__InjectBuffer = z.object({
  resources: z.array(
    z.object({
      sha256: schemaResource.shape.sha256,
      type: schemaResource.shape.type,
      n: schemaResource.shape.n,
    }),
  ),
});
export default schemaResource__InjectBuffer;
