import { searchBigPaintAction } from "@/actions/searchBigPaintAction";
import { searchBigPaintFormSchema } from "@/schemas/searchBigPaintFormSchema";
import { FormValues } from "@/utils/form";
import createQuery from "@/utils/query";

export default createQuery(
  (payload: FormValues<typeof searchBigPaintFormSchema>) =>
    searchBigPaintAction(payload),
);
