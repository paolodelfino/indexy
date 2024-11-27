import schemaUUID from "@/schemas/schemaUUID";
import { z } from "zod";

const schemaInspiration__DB = z.object({
  id: schemaUUID,
  date: z.date(),
  highlight: z.boolean(),
  content: z.string().trim().min(1),
});
export default schemaInspiration__DB;
