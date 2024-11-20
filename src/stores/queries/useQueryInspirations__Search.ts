import ActionSearch__Inspiration from "@/actions/ActionSearch__Inspiration";
import schemaInspiration__Search from "@/schemas/schemaInspiration__Search";
import { FormValues } from "@/utils/form";
import { createInfiniteQuery } from "@/utils/query";

export default createInfiniteQuery(
  20,
  (offset, limit, values: FormValues<typeof schemaInspiration__Search>) =>
    ActionSearch__Inspiration(offset, limit, values),
);
