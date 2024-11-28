import ActionFetch__InspirationPool from "@/actions/ActionFetch__InspirationPool";
import schemaEntry__InspirationPool__Fetch from "@/schemas/schemaEntry__InspirationPool__Fetch";
import { FormValues } from "@/utils/form";
import { createInfiniteQuery } from "@/utils/query";

const useQueryInspiration__Pool = createInfiniteQuery(
  20,
  (
    offset,
    limit,
    values: FormValues<typeof schemaEntry__InspirationPool__Fetch>,
  ) => ActionFetch__InspirationPool(offset, limit, values),
);
export default useQueryInspiration__Pool;
