import { searchInspirationAction } from "@/actions/searchInspirationAction";
import { searchInspirationFormSchema } from "@/schemas/searchInspirationFormSchema";
import { FormValues } from "@/utils/form";
import { createInfiniteQuery } from "@/utils/query";

export default createInfiniteQuery(
  20,
  (offset, limit, values: FormValues<typeof searchInspirationFormSchema>) =>
    searchInspirationAction(offset, limit, values),
);
