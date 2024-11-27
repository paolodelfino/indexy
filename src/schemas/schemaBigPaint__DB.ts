import schemaUUID from "@/schemas/schemaUUID";
import { z } from "zod";

const schemaBigPaint__DB = z.object({
  id: schemaUUID,
  date: z.date(),
  name: z.string().trim().min(1),
});
export default schemaBigPaint__DB;
