import schemaInspiration__DB from "@/schemas/schemaInspiration__DB";
import schemaUUID from "@/schemas/schemaUUID";
import { z } from "zod";

const schemaInspirationRelations = z.object({
  id: schemaUUID,
  inspiration1_id: schemaInspiration__DB.shape.id,
  inspiration2_id: schemaInspiration__DB.shape.id,
});
export default schemaInspirationRelations;
