import { fieldText } from "@/components/form/FormText";
import { editHistoryEntryFormSchema } from "@/schemas/updateHistorySchema";
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
