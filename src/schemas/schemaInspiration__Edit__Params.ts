import schemaInspiration__DB from "@/schemas/schemaInspiration__DB";
import { z } from "zod";

const schemaInspiration__Edit__Params = z.object({
  id: schemaInspiration__DB.shape.id,
});
export default schemaInspiration__Edit__Params;
