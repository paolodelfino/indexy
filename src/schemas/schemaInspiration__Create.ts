import { z } from "zod";

export default z.object({
  content: z.string().trim().min(1),
});
