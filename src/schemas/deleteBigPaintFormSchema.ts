import { idSchema } from "@/schemas/idSchema";
import { z } from "zod";

export const deleteBigPaintFormSchema = z.object({ id: idSchema });
