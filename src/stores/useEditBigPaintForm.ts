import { FieldDate } from "@/components/form/FormDate";
import { FieldSelectSearch } from "@/components/form/FormSelectSearch";
import { FieldText } from "@/components/form/FormText";
import { editBigPaintFormSchema } from "@/schemas/editBigPaintFormSchema";
import { createForm } from "@/utils/form";

// TODO: Probably has to be component-scoped context

export const useEditBigPaintForm = createForm(
  editBigPaintFormSchema,
  {
    date: {
      meta: {
        date: undefined,
        time: undefined,
      },
      value: undefined,
      default: {
        meta: {
          date: undefined,
          time: undefined,
        },
        value: undefined,
      },
      error: undefined,
    } satisfies FieldDate as FieldDate,
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
    } satisfies FieldSelectSearch as FieldSelectSearch,
    name: {
      meta: "",
      value: undefined,
      default: {
        meta: "",
        value: undefined,
      },
      error: undefined,
    } satisfies FieldText as FieldText,
  },
  {},
);
