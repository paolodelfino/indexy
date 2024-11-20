import { searchInspirationAction } from "@/actions/ActionSearch__Inspiration";
import { FormValues } from "@/utils/form";
import { createInfiniteQuery } from "@/utils/query";

export default createInfiniteQuery(
  20,
  (offset, limit, values: FormValues<typeof searchInspirationFormSchema>) =>
    searchInspirationAction(offset, limit, values),
);
