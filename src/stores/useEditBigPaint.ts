import { createForm } from "@/utils/form";

// TODO: Probably has to be component-scoped context

export interface Values {
  name: string | undefined;
  date: string | undefined;
  related_big_paints_ids: string[] | undefined;
}

const emptyValues: Values = {
  name: undefined,
  date: undefined,
  related_big_paints_ids: undefined,
};

export const useEditBigPaint = createForm(emptyValues);
