import { fieldDate } from "@/components/form/FieldDate";
import { fieldSelectSearch } from "@/components/form/FieldSelect__Search";
import { fieldText } from "@/components/form/FieldText";
import schemaBigPaint__Edit from "@/schemas/schemaBigPaint__Edit";
import { createForm } from "@/utils/form";

// TODO: Probably has to be component-scoped context

export default createForm(
  schemaBigPaint__Edit,
  {
    date: fieldDate(),
    related_big_paints_ids: fieldSelectSearch(),
    name: fieldText(),
  },
  {
    lastId: undefined as string | undefined,
  },
);
