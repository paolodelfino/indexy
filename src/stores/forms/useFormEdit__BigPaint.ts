import { fieldDate } from "@/components/form_ui/FieldDate";
import { fieldDynamicSelect } from "@/components/form_ui/FieldDynamicSelect";
import { fieldText } from "@/components/form_ui/FieldText";
import schemaBigPaint__Edit from "@/schemas/schemaBigPaint__Edit";
import { createForm } from "@/utils/form";

// TODO: Probably has to be component-scoped context

const useFormEdit__BigPaint = createForm(
  schemaBigPaint__Edit,
  {
    date: fieldDate(),
    related_big_paints_ids: fieldDynamicSelect(),
    related_inspirations_ids: fieldDynamicSelect(),
    name: fieldText(),
  },
  {
    lastId: undefined as string | undefined,
  },
);
export default useFormEdit__BigPaint;
