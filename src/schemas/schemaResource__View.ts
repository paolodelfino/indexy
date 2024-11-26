import schemaResource__DB from "@/schemas/schemaResource__DB";
import { z } from "zod";

const schemaResource__View = z.object({
  id: schemaResource__DB.shape.id,
});
export default schemaResource__View;
