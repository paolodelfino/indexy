import { searchBigPaintAction } from "@/actions/ActionSearch__BigPaint";
import schemaBigPaint__Search from "@/schemas/schemaBigPaint__Search";
import { FormValues } from "@/utils/form";
import { createInfiniteQuery } from "@/utils/query";

export default createInfiniteQuery(
  20,
  (offset, limit, values: FormValues<typeof schemaBigPaint__Search>) =>
    searchBigPaintAction(offset, limit, values),
);
