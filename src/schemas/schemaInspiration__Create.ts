import { z } from "zod";

// TODO: Extend this form
export default z.object({
  content: z.string().trim().min(1),
  resources: z.array(
    z.object({
      sha256: z
        .string()
        .trim()
        .regex(/^[a-f0-9]{64}$/i, "Invalid SHA-256 hash"),
      type: z.enum(["image", "binary"]),
      buff: z.instanceof(ArrayBuffer),
    }),
  ),
});
