import { fieldText } from "@/components/form/FormText";
import { createBigPaintFormSchema } from "@/schemas/createBigPaintFormSchema";
import { createForm } from "@/utils/form";

export const useCreateBigPaintForm = createForm(
  createBigPaintFormSchema,
  {
    name: fieldText(),
  },
  {},
);
