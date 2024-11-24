import schemaResource__DB from "@/schemas/schemaResource__DB";
import { z } from "zod";

const schemaResource__InjectBuffer = z.object({
  resources: z.array(
    z.object({
      sha256: schemaResource__DB.shape.sha256,
      type: schemaResource__DB.shape.type,
      n: schemaResource__DB.shape.n,
    }),
  ),
});
export default schemaResource__InjectBuffer;
