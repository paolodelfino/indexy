import { z } from "zod";

const updateHistorySchema = z.object({
  values: z.string().trim().min(3),
  date: z.date(), // TODO: Add date range check
  name: z.string().trim().min(1).nullable().optional(),
});

export default updateHistorySchema;
