import { fieldCheckbox } from "@/components/form_ui/FieldCheckbox";
import { fieldDate } from "@/components/form_ui/FieldDate";
import { fieldDynamicSelect } from "@/components/form_ui/FieldDynamicSelect";
import { fieldTextArea } from "@/components/form_ui/FieldTextArea";
import schemaInspiration__Edit from "@/schemas/schemaInspiration__Edit";
import { createForm } from "@/utils/form";

// TODO: Probably has to be component-scoped context

export default createForm(
  schemaInspiration__Edit,
  {
    date: fieldDate(),
    related_big_paints_ids: fieldDynamicSelect(),
    content: fieldTextArea(),
    highlight: fieldCheckbox(),
    related_inspirations_ids: fieldDynamicSelect(),
  },
  { lastId: undefined as string | undefined },
);
