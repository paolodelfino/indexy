import ActionSearch__BigPaint from "@/actions/ActionSearch__BigPaint2";
import schemaBigPaint__Search from "@/schemas/schemaBigPaint__Search";
import { FormValues } from "@/utils/form";
import { createInfiniteQuery } from "@/utils/query";

export default createInfiniteQuery(
  20,
  (offset, limit, values: FormValues<typeof schemaBigPaint__Search>) =>
    ActionSearch__BigPaint(offset, limit, values),
);
