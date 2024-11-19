"use client";

import { searchBigPaintAction } from "@/actions/searchBigPaintAction";
import { searchInspirationAction } from "@/actions/searchInspirationAction";
import Button from "@/components/Button";
import FormCheckbox from "@/components/form/FormCheckbox";
import FormDateComparison from "@/components/form/FormDateComparison";
import FormSelect from "@/components/form/FormSelect";
import FormSelectSearch from "@/components/form/FormSelectSearch";
import FormTextArea from "@/components/form/FormTextArea";
import { Cloud, InformationCircle } from "@/components/icons";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/popover";
import { useSearchInspirationForm } from "@/stores/useSearchInspirationForm";
import { valuesToSearchParams } from "@/utils/url";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function InspirationSearchForm() {
  const form = useSearchInspirationForm();
  const router = useRouter();

  useEffect(() => {
    // TODO: Vedi se questo problema del cambio route si è risolto ora che non uso più quello schifo di query management
    form.setOnSubmit((form) =>
      router.push(`/result/inspiration?${valuesToSearchParams(form.values())}`),
    );
  }, [form.setOnSubmit]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end gap-2 p-4">
        {form.error !== undefined && (
          <Popover>
            <PopoverTrigger color="danger">
              <InformationCircle />
            </PopoverTrigger>
            <PopoverContent className="rounded border bg-neutral-700 p-4 italic">
              {form.error}
            </PopoverContent>
          </Popover>
        )}

        <Button
          title="Clear"
          // disabled={query.isFetching}
          color="ghost"
          onClick={form.reset}
        >
          <Cloud />
        </Button>

        <Button
          color="accent"
          // disabled={query.isFetching || form.isInvalid}
          disabled={form.isInvalid}
          onClick={form.submit}
        >
          {/* {query.isFetching ? "Searching..." : "Search"} */}
          Search
        </Button>
      </div>

      <h1
        // data-disabled={query.isFetching}
        className="py-1 pl-4 text-2xl font-medium leading-[3rem] data-[disabled=true]:opacity-50"
      >
        Search Inspiration
      </h1>

      <div>
        <h2
          // data-disabled={query.isFetching}
          className="py-1 pl-4 text-lg font-medium leading-10 data-[disabled=true]:opacity-50"
        >
          Order
        </h2>

        <div className="flex gap-2">
          <FormSelect
            placeholder="Order By"
            meta={form.fields.orderBy.meta}
            setValue={form.setValue.bind(form, "orderBy")}
            setMeta={form.setMeta.bind(form, "orderBy")}
            // disabled={query.isFetching}
            disabled={false}
            error={form.fields.orderBy.error}
          />

          <FormSelect
            placeholder="Order By Dir"
            meta={form.fields.orderByDir.meta}
            setValue={form.setValue.bind(form, "orderByDir")}
            setMeta={form.setMeta.bind(form, "orderByDir")}
            // disabled={query.isFetching}
            disabled={false}
            error={form.fields.orderByDir.error}
          />
        </div>
      </div>

      <FormTextArea
        label="Content"
        meta={form.fields.content.meta}
        setValue={form.setValue.bind(form, "content")}
        setMeta={form.setMeta.bind(form, "content")}
        // disabled={query.isFetching}
        disabled={false}
        error={form.fields.content.error}
        acceptIndeterminate
      />

      <div>
        <h2
          // data-disabled={query.isFetching}
          className="py-1 pl-4 text-lg font-medium leading-10 data-[disabled=true]:opacity-50"
        >
          Date
        </h2>

        <FormDateComparison
          title="Date"
          meta={form.fields.date.meta}
          setValue={form.setValue.bind(form, "date")}
          setMeta={form.setMeta.bind(form, "date")}
          // disabled={query.isFetching}
          disabled={false}
          error={form.fields.date.error}
          acceptIndeterminate
        />
      </div>

      <div>
        <h2
          // data-disabled={query.isFetching}
          className="py-1 pl-4 text-lg font-medium leading-10 data-[disabled=true]:opacity-50"
        >
          Highlight
        </h2>

        <FormCheckbox
          label="Highlight"
          meta={form.fields.highlight.meta}
          setValue={form.setValue.bind(form, "highlight")}
          setMeta={form.setMeta.bind(form, "highlight")}
          // disabled={query.isFetching}
          disabled={false}
          error={form.fields.highlight.error}
          acceptIndeterminate
        />
      </div>

      <FormSelectSearch
        title="Related BigPaints"
        meta={form.fields.related_big_paints_ids.meta}
        setValue={form.setValue.bind(form, "related_big_paints_ids")}
        setMeta={form.setMeta.bind(form, "related_big_paints_ids")}
        // disabled={query.isFetching}
        disabled={false}
        error={form.fields.related_big_paints_ids.error}
        acceptIndeterminate
        search={(prevState, { query }) =>
          searchBigPaintAction(null, null, {
            name: query,
            orderBy: "date",
            orderByDir: "asc",
            date: undefined,
            related_big_paints_ids: undefined,
          }).then((res) =>
            res.data.map((item) => ({
              content: item.name,
              id: item.id,
            })),
          )
        }
      />

      <FormSelectSearch
        title="Related Inspirations"
        meta={form.fields.related_inspirations_ids.meta}
        setValue={form.setValue.bind(form, "related_inspirations_ids")}
        setMeta={form.setMeta.bind(form, "related_inspirations_ids")}
        // disabled={query.isFetching}
        disabled={false}
        error={form.fields.related_inspirations_ids.error}
        acceptIndeterminate
        search={(prevState, { query }) =>
          searchInspirationAction(null, null, {
            content: query,
            orderBy: "date",
            orderByDir: "asc",
            date: undefined,
            related_inspirations_ids: undefined,
            related_big_paints_ids: undefined,
            highlight: undefined,
          }).then((res) =>
            res.data.map((item) => ({
              content: item.content,
              id: item.id,
            })),
          )
        }
      />
    </div>
  );
}
