import schemaUUID from "@/schemas/schemaUUID";
import { z } from "zod";

const schemaResource__DB = z.object({
  id: schemaUUID,
  sha256: z
    .string()
    .trim()
    .regex(/^[a-f0-9]{64}$/i, "Invalid SHA-256 hash"),
  type: z.enum(["image", "binary", "video", "audio"]),
  n: z.number().gt(0),
  inspiration_id: schemaUUID,
});
export default schemaResource__DB;
