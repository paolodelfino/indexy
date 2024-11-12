import { FieldText } from "@/components/form/FormText";
import { createBigPaintFormSchema } from "@/schemas/createBigPaintFormSchema";
import { createForm } from "@/utils/form2";

export const useCreateBigPaintForm = createForm(
  createBigPaintFormSchema,
  {
    name: {
      meta: "",
      value: "",
      default: {
        meta: "",
        value: "",
      },
      error: undefined,
    } satisfies FieldText<false>,
  },
  {},
);
