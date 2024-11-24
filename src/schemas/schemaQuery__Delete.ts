import schemaQuery__DB from "@/schemas/schemaQuery__DB";
import { z } from "zod";

const schemaQuery__Delete = z.object({ values: schemaQuery__DB.shape.values });
export default schemaQuery__Delete;
