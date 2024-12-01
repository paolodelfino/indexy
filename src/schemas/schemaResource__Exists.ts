import schemaResource__DB from "@/schemas/schemaResource__DB";
import { z } from "zod";

const schemaResource__Exists = z.object({
  sha256: schemaResource__DB.shape.sha256,
  type: schemaResource__DB.shape.type,
});
export default schemaResource__Exists;
