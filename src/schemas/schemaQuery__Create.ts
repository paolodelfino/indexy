import schemaId__Query from "@/schemas/schemaId__Query";
import { z } from "zod";

export default z.object({
  values: schemaId__Query,
  name: z.string().trim().min(1),
  category: z.enum(["inspiration", "big_paint"]),
});
