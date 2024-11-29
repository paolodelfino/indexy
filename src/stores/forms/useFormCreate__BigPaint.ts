import { fieldText } from "@/components/form_ui/FieldText";
import schemaBigPaint__Create from "@/schemas/schemaBigPaint__Create";
import { createForm } from "@/utils/form";

const useFormCreate__BigPaint = createForm(
  schemaBigPaint__Create,
  {
    name: fieldText(),
  },
  {},
);
export default useFormCreate__BigPaint;
