import { fieldCheckbox } from "@/components/form/FieldCheckbox";
import { fieldDate } from "@/components/form/FieldDate";
import { fieldSelectSearch } from "@/components/form/FieldSelect__Search";
import { fieldTextArea } from "@/components/form/FieldText__Area";
import schemaInspiration__Edit from "@/schemas/schemaInspiration__Edit";
import { createForm } from "@/utils/form";

// TODO: Probably has to be component-scoped context

export default createForm(
  schemaInspiration__Edit,
  {
    date: fieldDate(),
    related_big_paints_ids: fieldSelectSearch(),
    content: fieldTextArea(),
    highlight: fieldCheckbox(),
    related_inspirations_ids: fieldSelectSearch(),
  },
  { lastId: undefined as string | undefined },
);
