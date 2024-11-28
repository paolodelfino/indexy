import ActionFetch__BigPaintPool from "@/actions/ActionFetch__BigPaintPool";
import schemaEntry__BigPaintPool__Fetch from "@/schemas/schemaEntry__BigPaintPool__Fetch";
import { FormValues } from "@/utils/form";
import { createInfiniteQuery } from "@/utils/query";

const useQueryBigPaint__Pool = createInfiniteQuery(
  20,
  (
    offset,
    limit,
    values: FormValues<typeof schemaEntry__BigPaintPool__Fetch>,
  ) => ActionFetch__BigPaintPool(offset, limit, values),
);
export default useQueryBigPaint__Pool;
