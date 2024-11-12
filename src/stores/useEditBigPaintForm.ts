import { FieldDate } from "@/components/form/FormDate";
import { FieldSelectSearch } from "@/components/form/FormSelectSearch";
import { FieldText } from "@/components/form/FormText";
import { editBigPaintFormSchema } from "@/schemas/editBigPaintFormSchema";
import { createForm } from "@/utils/form2";

// TODO: Probably has to be component-scoped context

export const useEditBigPaintForm = createForm(
  editBigPaintFormSchema,
  {
    date: {
      meta: undefined,
      value: undefined,
      default: {
        meta: undefined,
        value: undefined,
      },
      error: undefined,
    } satisfies FieldDate<true>,
    related_big_paints_ids: {
      meta: {
        selectedItems: [],
        showSearch: false,
        searchResult: [],
        searchQueryMeta: "",
        searchQueryValue: "",
        searchQueryError: undefined,
      },
      value: undefined,
      default: {
        meta: {
          selectedItems: [],
          showSearch: false,
          searchResult: [],
          searchQueryMeta: "",
          searchQueryValue: "",
          searchQueryError: undefined,
        },
        value: undefined,
      },
      error: undefined,
    } satisfies FieldSelectSearch<true>,
    name: {
      meta: "",
      value: undefined,
      default: {
        meta: "",
        value: undefined,
      },
      error: undefined,
    } satisfies FieldText<true>,
  },
  {
    lastId: undefined satisfies string | undefined as string | undefined,
  },
);
