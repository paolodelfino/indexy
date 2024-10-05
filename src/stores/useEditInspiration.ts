import { createForm } from "@/utils/form";

// TODO: Probably has to be component-scoped context

export interface Values {
  content: string | undefined;
  date: string | undefined;
  highlight: boolean | undefined;
  related_big_paints_ids: string[] | undefined;
  related_inspirations_ids: string[] | undefined;
}

const emptyValues: Values = {
  content: undefined,
  date: undefined,
  related_big_paints_ids: undefined,
  highlight: undefined,
  related_inspirations_ids: undefined,
};

export const useEditInspiration = createForm(emptyValues);
