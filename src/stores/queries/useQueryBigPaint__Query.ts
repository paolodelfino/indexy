import ActionQuery__BigPaint from "@/actions/ActionQuery__BigPaint";
import schemaBigPaint__Query from "@/schemas/schemaBigPaint__Query";
import { FormValues } from "@/utils/form";
import { createInfiniteQuery } from "@/utils/query";

const useQueryBigPaint__Query = createInfiniteQuery(
  20,
  (offset, limit, values: FormValues<typeof schemaBigPaint__Query>) =>
    ActionQuery__BigPaint(offset, limit, values),
);
export default useQueryBigPaint__Query;
