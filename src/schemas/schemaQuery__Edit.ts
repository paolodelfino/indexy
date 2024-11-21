import { z } from "zod";

export default z.object({
  name: z.string().trim().min(1).optional(),
  date: z.date().optional(), // TODO: Add date range check
});
