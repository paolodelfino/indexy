import schemaInspiration__DB from "@/schemas/schemaInspiration__DB";
import { z } from "zod";

export default z.object({ id: schemaInspiration__DB.shape.id });
