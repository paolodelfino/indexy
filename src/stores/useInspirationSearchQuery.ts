import { searchInspirationAction } from "@/actions/searchInspirationAction";
import { searchInspirationFormSchema } from "@/schemas/searchInspirationFormSchema";
import { FormValues } from "@/utils/form2";
import createQuery from "@/utils/query";

export default createQuery(
  (payload: FormValues<typeof searchInspirationFormSchema>) =>
    searchInspirationAction(payload),
);
