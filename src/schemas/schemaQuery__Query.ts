import schemaQuery__DB from "@/schemas/schemaQuery__DB";
import { z } from "zod";

const schemaQuery__Query = z.object({
  name: z.string().trim().min(1),
  category: schemaQuery__DB.shape.category,
});
export default schemaQuery__Query;
