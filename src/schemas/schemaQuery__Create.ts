import schemaQuery__DB from "@/schemas/schemaQuery__DB";
import { z } from "zod";

const schemaQuery__Create = z.object({
  values: schemaQuery__DB.shape.values,
  name: schemaQuery__DB.shape.name,
  category: schemaQuery__DB.shape.category,
});
export default schemaQuery__Create;
