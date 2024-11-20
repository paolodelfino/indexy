import { idSchema } from "@/schemas/schemaId__InspirationBigPaint";
import { z } from "zod";

export default z.object({ id: idSchema });
