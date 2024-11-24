import schemaBigPaint__DB from "@/schemas/schemaBigPaint__DB";
import { z } from "zod";

const schemaBigPaint__Create = z.object({
  name: schemaBigPaint__DB.shape.name,
});
export default schemaBigPaint__Create;
