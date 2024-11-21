"use client";

import ActionCreate__Query from "@/actions/ActionCreate__Query";
import ActionSearch__BigPaint from "@/actions/ActionSearch__BigPaint";
import ActionSearch__Inspiration from "@/actions/ActionSearch__Inspiration";
import Button from "@/components/Button";
import FieldCheckbox from "@/components/form_ui/FieldCheckbox";
import FieldComparisonDate from "@/components/form_ui/FieldComparisonDate";
import FieldDynamicSelect from "@/components/form_ui/FieldDynamicSelect";
import FieldSelect from "@/components/form_ui/FieldSelect";
import FieldTextArea from "@/components/form_ui/FieldTextArea";
import { Cloud, InformationCircle } from "@/components/icons";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/popover";
import useFormSearch__Inspiration from "@/stores/forms/useFormSearch__Inspiration";
import useQueryQueries__View from "@/stores/queries/useQueryQueries__View";
import { valuesToSearchParams } from "@/utils/url";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const form = useFormSearch__Inspiration();
  const router = useRouter();

  const [isFormPending, setIsFormPending] = useState(false);

  const invalidateQueryQueries_View = useQueryQueries__View(
    (state) => state.invalidate,
  );

  useEffect(() => {
    // TODO: Vedi se questo problema del cambio route si è risolto ora che non uso più quello schifo di query management
    form.setOnSubmit(async (form) => {
      setIsFormPending(true);

      await ActionCreate__Query({
        values: decodeURIComponent(valuesToSearchParams(form.values())),
        category: "inspiration",
        name: "Untitled",
      });
      invalidateQueryQueries_View(); // TODO: Non avevo pensato allo scenario in cui la funzione non finisce in tempo, siam sicuri che continua lo stesso?

      setIsFormPending(false);
    });
  }, [form.setOnSubmit]);

  return (
    <div className="space-y-6 pb-16">
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
          disabled={isFormPending}
          color="ghost"
          onClick={form.reset}
        >
          <Cloud />
        </Button>

        <Button
          color="accent"
          disabled={isFormPending || form.isInvalid}
          onClick={form.submit}
        >
          {isFormPending ? "Creating..." : "Create"}
        </Button>

        <Button
          disabled={isFormPending || form.isInvalid}
          onClick={() =>
            router.push(
              `/${valuesToSearchParams(form.values())}/query/inspiration`,
            )
          }
        >
          Search
        </Button>
      </div>

      <h1
        data-disabled={isFormPending}
        className="py-1 pl-4 text-2xl font-medium leading-[3rem] data-[disabled=true]:opacity-50"
      >
        Search Inspiration
      </h1>

      <div>
        <h2
          data-disabled={isFormPending}
          className="py-1 pl-4 text-lg font-medium leading-10 data-[disabled=true]:opacity-50"
        >
          Order
        </h2>

        <div className="flex gap-2">
          <FieldSelect
            placeholder="Order By"
            meta={form.fields.orderBy.meta}
            setValue={form.setValue.bind(form, "orderBy")}
            setMeta={form.setMeta.bind(form, "orderBy")}
            disabled={isFormPending}
            error={form.fields.orderBy.error}
          />

          <FieldSelect
            placeholder="Order By Dir"
            meta={form.fields.orderByDir.meta}
            setValue={form.setValue.bind(form, "orderByDir")}
            setMeta={form.setMeta.bind(form, "orderByDir")}
            disabled={isFormPending}
            error={form.fields.orderByDir.error}
          />
        </div>
      </div>

      <FieldTextArea
        label="Content"
        meta={form.fields.content.meta}
        setValue={form.setValue.bind(form, "content")}
        setMeta={form.setMeta.bind(form, "content")}
        disabled={isFormPending}
        error={form.fields.content.error}
        acceptIndeterminate
      />

      <div>
        <h2
          data-disabled={isFormPending}
          className="py-1 pl-4 text-lg font-medium leading-10 data-[disabled=true]:opacity-50"
        >
          Date
        </h2>

        <FieldComparisonDate
          title="Date"
          meta={form.fields.date.meta}
          setValue={form.setValue.bind(form, "date")}
          setMeta={form.setMeta.bind(form, "date")}
          disabled={isFormPending}
          error={form.fields.date.error}
          acceptIndeterminate
        />
      </div>

      <div>
        <h2
          data-disabled={isFormPending}
          className="py-1 pl-4 text-lg font-medium leading-10 data-[disabled=true]:opacity-50"
        >
          Highlight
        </h2>

        <FieldCheckbox
          label="Highlight"
          meta={form.fields.highlight.meta}
          setValue={form.setValue.bind(form, "highlight")}
          setMeta={form.setMeta.bind(form, "highlight")}
          disabled={isFormPending}
          error={form.fields.highlight.error}
          acceptIndeterminate
        />
      </div>

      <FieldDynamicSelect
        title="Related BigPaints"
        meta={form.fields.related_big_paints_ids.meta}
        setValue={form.setValue.bind(form, "related_big_paints_ids")}
        setMeta={form.setMeta.bind(form, "related_big_paints_ids")}
        disabled={isFormPending}
        error={form.fields.related_big_paints_ids.error}
        acceptIndeterminate
        search={(prevState, { query }) =>
          ActionSearch__BigPaint(null, null, {
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

      <FieldDynamicSelect
        title="Related Inspirations"
        meta={form.fields.related_inspirations_ids.meta}
        setValue={form.setValue.bind(form, "related_inspirations_ids")}
        setMeta={form.setMeta.bind(form, "related_inspirations_ids")}
        disabled={isFormPending}
        error={form.fields.related_inspirations_ids.error}
        acceptIndeterminate
        search={(prevState, { query }) =>
          ActionSearch__Inspiration(null, null, {
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
