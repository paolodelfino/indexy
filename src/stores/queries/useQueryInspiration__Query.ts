import ActionQuery__Inspiration from "@/actions/ActionQuery__Inspiration";
import schemaInspiration__Query from "@/schemas/schemaInspiration__Query";
import { FormValues } from "@/utils/form";
import { createInfiniteQuery } from "@/utils/query";

const useQueryInspiration__Query = createInfiniteQuery(
  20,
  (offset, limit, values: FormValues<typeof schemaInspiration__Query>) =>
    ActionQuery__Inspiration(offset, limit, values),
);
export default useQueryInspiration__Query;
