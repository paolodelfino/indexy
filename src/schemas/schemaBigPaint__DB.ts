import schemaUUID from "@/schemas/schemaUUID";
import { z } from "zod";

const schemaBigPaint__DB = z.object({
  id: schemaUUID,
  date: z.date(),
  name: z.string().trim().min(1),
  related_big_paints_ids: z.array(schemaUUID),
});
export default schemaBigPaint__DB;
