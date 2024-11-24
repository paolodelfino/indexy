import schemaQuery__DB from "@/schemas/schemaQuery__DB";
import { z } from "zod";

const schemaQuery__Edit = z.object({
  name: schemaQuery__DB.shape.name.optional(),
  date: schemaQuery__DB.shape.date.optional(), // TODO: Add date range check
});
export default schemaQuery__Edit;
