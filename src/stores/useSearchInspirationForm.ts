import { FieldCheckbox } from "@/components/form/FormCheckbox";
import { FieldDateComparison } from "@/components/form/FormDateComparison";
import { FieldSelect, indeterminateGuard } from "@/components/form/FormSelect";
import { FieldSelectSearch } from "@/components/form/FormSelectSearch";
import { FieldTextArea } from "@/components/form/FormTextArea";
import { searchInspirationFormSchema } from "@/schemas/searchInspirationFormSchema";
import { createForm } from "@/utils/form";

export const useSearchInspirationForm = createForm(
  searchInspirationFormSchema,
  {
    date: {
      meta: {
        comparison: {
          meta: {
            items: [
              { content: "=", id: "=" },
              { content: "<=", id: "<=" },
              { content: ">=", id: ">=" },
              { content: "<", id: "<" },
              { content: ">", id: ">" },
              { content: "Between", id: "between" },
            ],
            selectedItem: indeterminateGuard,
          },
          value: undefined,
          default: {
            meta: {
              items: [
                { content: "=", id: "=" },
                { content: "<=", id: "<=" },
                { content: ">=", id: ">=" },
                { content: "<", id: "<" },
                { content: ">", id: ">" },
                { content: "Between", id: "between" },
              ],
              selectedItem: indeterminateGuard,
            },
            value: undefined,
          },
          error: undefined,
        },
        date: undefined,
        date2: undefined,
      },
      value: undefined,
      default: {
        meta: {
          comparison: {
            meta: {
              items: [
                { content: "=", id: "=" },
                { content: "<=", id: "<=" },
                { content: ">=", id: ">=" },
                { content: "<", id: "<" },
                { content: ">", id: ">" },
                { content: "Between", id: "between" },
              ],
              selectedItem: indeterminateGuard,
            },
            value: undefined,
            default: {
              meta: {
                items: [
                  { content: "=", id: "=" },
                  { content: "<=", id: "<=" },
                  { content: ">=", id: ">=" },
                  { content: "<", id: "<" },
                  { content: ">", id: ">" },
                  { content: "Between", id: "between" },
                ],
                selectedItem: indeterminateGuard,
              },
              value: undefined,
            },
            error: undefined,
          },
          date: undefined,
          date2: undefined,
        },
        value: undefined,
      },
      error: undefined,
    } satisfies FieldDateComparison as FieldDateComparison,
    orderBy: {
      meta: {
        items: [
          { content: "Date", id: "date" },
          { content: "Content", id: "content" },
          { content: "Highlight", id: "highlight" },
        ],
        selectedItem: { content: "Date", id: "date" },
      },
      value: "date",
      default: {
        meta: {
          items: [
            { content: "Date", id: "date" },
            { content: "Content", id: "content" },
            { content: "Highlight", id: "highlight" },
          ],
          selectedItem: { content: "Date", id: "date" },
        },
        value: "date",
      },
      error: undefined,
    } satisfies FieldSelect as FieldSelect,
    orderByDir: {
      meta: {
        items: [
          { content: "Desc", id: "desc" },
          { content: "Asc", id: "asc" },
        ],
        selectedItem: { content: "Asc", id: "asc" },
      },
      value: "asc",
      default: {
        meta: {
          items: [
            { content: "Desc", id: "desc" },
            { content: "Asc", id: "asc" },
          ],
          selectedItem: { content: "Asc", id: "asc" },
        },
        value: "asc",
      },
      error: undefined,
    } satisfies FieldSelect as FieldSelect,
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
    content: {
      meta: "",
      value: undefined,
      default: {
        meta: "",
        value: undefined,
      },
      error: undefined,
    } satisfies FieldTextArea as FieldTextArea,
    highlight: {
      meta: undefined,
      value: undefined,
      default: {
        meta: undefined,
        value: undefined,
      },
      error: undefined,
    } satisfies FieldCheckbox as FieldCheckbox,
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
    } satisfies FieldSelectSearch as FieldSelectSearch,
  },
  {},
);
