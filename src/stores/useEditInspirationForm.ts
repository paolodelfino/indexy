import { FieldCheckbox } from "@/components/form/FormCheckbox";
import { FieldDate } from "@/components/form/FormDate";
import { FieldSelectSearch } from "@/components/form/FormSelectSearch";
import { FieldTextArea } from "@/components/form/FormTextArea";
import { editInspirationFormSchema } from "@/schemas/editInspirationFormSchema";
import { createForm } from "@/utils/form";

// TODO: Probably has to be component-scoped context

export const useEditInspirationForm = createForm(
  editInspirationFormSchema,
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
    } satisfies FieldSelectSearch<true> as FieldSelectSearch<true>,
    content: {
      meta: "",
      value: undefined,
      default: {
        meta: "",
        value: undefined,
      },
      error: undefined,
    } satisfies FieldTextArea<true> as FieldTextArea<true>,
    highlight: {
      meta: undefined,
      value: undefined,
      default: {
        meta: undefined,
        value: undefined,
      },
      error: undefined,
    } satisfies FieldCheckbox<true> as FieldCheckbox<true>,
    related_inspirations_ids: {
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
    } satisfies FieldSelectSearch<true> as FieldSelectSearch<true>,
  },
  {
    lastId: undefined satisfies string | undefined as string | undefined,
  },
);
