import schemaId__Query from "@/schemas/schemaId__Query";
import { z } from "zod";

// TODO: Perché ce ne sono due?

export default z.object({
  values: schemaId__Query,
  date: z.date().optional(), // TODO: Add date range check
  name: z.string().trim().min(1).optional(),
});
