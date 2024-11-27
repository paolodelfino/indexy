import schemaBigPaint__DB from "@/schemas/schemaBigPaint__DB";
import { z } from "zod";

const schemaBigPaint__Edit__Params = z.object({
  id: schemaBigPaint__DB.shape.id,
});
export default schemaBigPaint__Edit__Params;
