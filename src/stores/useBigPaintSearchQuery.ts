import { searchBigPaintAction } from "@/actions/searchBigPaintAction";
import { searchBigPaintFormSchema } from "@/schemas/searchBigPaintFormSchema";
import { FormValues } from "@/utils/form";
import { createInfiniteQuery } from "@/utils/query";

export default createInfiniteQuery(
  20,
  (offset, limit, values: FormValues<typeof searchBigPaintFormSchema>) =>
    searchBigPaintAction(offset, limit, values),
);
