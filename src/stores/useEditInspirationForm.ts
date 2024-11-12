import { FieldCheckbox } from "@/components/form/FormCheckbox";
import { FieldDate } from "@/components/form/FormDate";
import { FieldSelectSearch } from "@/components/form/FormSelectSearch";
import { FieldTextArea } from "@/components/form/FormTextArea";
import { editInspirationFormSchema } from "@/schemas/editInspirationFormSchema";
import { createForm } from "@/utils/form2";

// TODO: Probably has to be component-scoped context

export const useEditInspirationForm = createForm(
  editInspirationFormSchema,
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
    content: {
      meta: "",
      value: undefined,
      default: {
        meta: "",
        value: undefined,
      },
      error: undefined,
    } satisfies FieldTextArea<true>,
    highlight: {
      meta: undefined,
      value: undefined,
      default: {
        meta: undefined,
        value: undefined,
      },
      error: undefined,
    } satisfies FieldCheckbox<true>,
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
    } satisfies FieldSelectSearch<true>,
  },
  {
    lastId: undefined satisfies string | undefined as string | undefined,
  },
);
