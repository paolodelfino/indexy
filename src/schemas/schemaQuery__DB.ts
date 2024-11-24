import { z } from "zod";

const schemaQuery__DB = z.object({
  values: z.string().trim().min(3),
  date: z.date(),
  name: z.string().trim().min(1),
  category: z.enum(["inspiration", "big_paint"]),
});
export default schemaQuery__DB;
