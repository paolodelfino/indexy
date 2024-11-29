import ActionQuery__Query from "@/actions/ActionQuery__Query";
import schemaQuery__Query from "@/schemas/schemaQuery__Query";
import { FormValues } from "@/utils/form";
import { createInfiniteQuery } from "@/utils/query";

const useQueryQuery__Query = createInfiniteQuery(
  20,
  (offset, limit, values: FormValues<typeof schemaQuery__Query>) =>
    ActionQuery__Query(offset, limit, values),
);
export default useQueryQuery__Query;
