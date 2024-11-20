import { fieldText } from "@/components/form/FieldText";
import { editHistoryEntryFormSchema } from "@/schemas/schemaQuery__Update";
import { createForm } from "@/utils/form";

const useEditHistoryEntryForm = createForm(
  editHistoryEntryFormSchema,
  {
    name: fieldText(),
  },
  {
    lastId: undefined as string | undefined,
  },
);

export default useEditHistoryEntryForm;
