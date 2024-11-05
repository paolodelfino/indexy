"use client";

import { searchBigPaintAction } from "@/actions/searchBigPaintAction";
import FormSelectSearch, {
  FieldSelectSearch,
} from "@/components/form/FormSelectSearch";
import { idSchema } from "@/schemas/idSchema";
import { createForm } from "@/utils/form2";
import { useEffect } from "react";
import { z } from "zod";

const useForm = createForm(
  z.object({
    relatedBigPaintsIds: z.array(idSchema),
  }),
  {
    relatedBigPaintsIds: {
      meta: {
        selectedItems: [],
        showSearch: false,
        searchResult: [],
        searchQueryMeta: "",
        searchQueryValue: "",
        searchQueryError: undefined,
      },
      value: [],
      default: {
        meta: {
          selectedItems: [],
          showSearch: false,
          searchResult: [],
          searchQueryMeta: "",
          searchQueryValue: "",
          searchQueryError: undefined,
        },
        value: [],
      },
      error: undefined,
    } satisfies FieldSelectSearch as FieldSelectSearch,
  },
);

export default function Example6() {
  const form = useForm();

  useEffect(() => {
    // console.log(
    // "form.fields.relatedBigPaintsIds.value changed",
    // form.fields.relatedBigPaintsIds.value,
    // );
  }, [form.fields.relatedBigPaintsIds.value]);

  useEffect(() => {
    // console.log(
    // "form.fields.relatedBigPaintsIds.error changed",
    // form.fields.relatedBigPaintsIds.error,
    // );
  }, [form.fields.relatedBigPaintsIds.error]);

  return (
    <FormSelectSearch
      meta={form.fields.relatedBigPaintsIds.meta}
      setMeta={form.setMeta.bind(form, "relatedBigPaintsIds")}
      setValue={form.setValue.bind(form, "relatedBigPaintsIds")}
      acceptIndeterminate
      error={form.fields.relatedBigPaintsIds.error}
      disabled={false}
      title="Related BigPaints"
      search={(_, { query }) =>
        searchBigPaintAction({
          name: query,
          date: undefined,
          related_big_paints_ids: undefined,
          orderBy: "date",
          orderByDir: "asc",
        }).then((result) =>
          result.data.map((it) => ({ content: it.name, id: it.id })),
        )
      }
    />
  );
}
