import schemaUUID from "@/schemas/schemaUUID";
import { z } from "zod";

const schemaInspiration__DB = z.object({
  id: schemaUUID,
  date: z.date(),
  highlight: z.boolean(),
  content: z.string().trim().min(1),
  related_big_paints_ids: z.array(schemaUUID),
  related_inspirations_ids: z.array(schemaUUID),
});
export default schemaInspiration__DB;
