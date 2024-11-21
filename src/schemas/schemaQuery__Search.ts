import { z } from "zod";

export default z.object({
  name: z.string().trim().min(1),
});
