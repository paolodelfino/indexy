import ActionSearch__Query from "@/actions/ActionSearch__Query";
import schemaQuery__Search from "@/schemas/schemaQuery__Search";
import { FormValues } from "@/utils/form";
import { createInfiniteQuery } from "@/utils/query";

export default createInfiniteQuery(
  20,
  (offset, limit, values: FormValues<typeof schemaQuery__Search>) =>
    ActionSearch__Query(offset, limit, values),
);
