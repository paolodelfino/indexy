import { searchInspirationAction } from "@/actions/ActionSearch__Inspiration";
import schemaInspiration__Search from "@/schemas/schemaInspiration__Search";
import { FormValues } from "@/utils/form";
import { createInfiniteQuery } from "@/utils/query";

export default createInfiniteQuery(
  20,
  (offset, limit, values: FormValues<typeof schemaInspiration__Search>) =>
    searchInspirationAction(offset, limit, values),
);
