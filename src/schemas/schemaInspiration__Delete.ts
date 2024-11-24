import schemaUUID from "@/schemas/schemaUUID";
import { z } from "zod";

export default z.object({ id: schemaUUID });
