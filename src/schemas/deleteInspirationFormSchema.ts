import { idSchema } from "@/schemas/idSchema";
import { z } from "zod";

export const deleteInspirationFormSchema = z.object({ id: idSchema });
