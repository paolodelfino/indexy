import { z } from "zod";

export default z.object({
  name: z.string().trim().min(1),
  category: z.enum(["inspiration", "big_paint"]),
});
