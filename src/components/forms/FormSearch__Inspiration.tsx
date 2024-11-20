"use client";

import ActionSearch__BigPaint from "@/actions/ActionSearch__BigPaint";
import ActionSearch__Inspiration from "@/actions/ActionSearch__Inspiration";
import updateInspirationHistoryAction from "@/actions/ActionEdit__Query";
import Button from "@/components/Button";
import FieldCheckbox from "@/components/form_ui/FieldCheckbox";
import FieldComparisonDate from "@/components/form_ui/FieldComparisonDate";
import FieldSelect from "@/components/form_ui/FieldSelect";
import FieldDynamicSelect from "@/components/form_ui/FieldDynamicSelect";
import FieldTextArea from "@/components/form_ui/FieldTextArea";
import { Cloud, InformationCircle } from "@/components/icons";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/popover";
import useInspirationHistoryQuery from "@/stores/queries/useQueryQueries__View";
import useFormSearch__Inspiration from "@/stores/forms/useFormSearch__Inspiration";
import { valuesToSearchParams } from "@/utils/url";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function FormSearch__Inspiration() {
  const form = useFormSearch__Inspiration();
  const router = useRouter();
  const [isHistoryPending, setIsHistoryPending] = useState(false);
  const invalidateInspirationHistoryQuery = useInspirationHistoryQuery(
    (state) => state.invalidate,
  );

  useEffect(() => {
    // TODO: Vedi se questo problema del cambio route si è risolto ora che non uso più quello schifo di query management
    form.setOnSubmit(async (form) => {
      setIsHistoryPending(true);

      const values = valuesToSearchParams(form.values());

      await updateInspirationHistoryAction({ values, date: new Date() });

      invalidateInspirationHistoryQuery(); // TODO: Non avevo pensato allo scenario in cui la funzione non finisce in tempo, siam sicuri che continua lo stesso?

      setIsHistoryPending(false);

      router.push(`/result/inspiration?${values}`);
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
          disabled={isHistoryPending}
          color="ghost"
          onClick={form.reset}
        >
          <Cloud />
        </Button>

        <Button
          color="accent"
          disabled={isHistoryPending || form.isInvalid}
          onClick={form.submit}
        >
          {isHistoryPending ? "Updating history..." : "Search"}
        </Button>
      </div>

      <h1
        data-disabled={isHistoryPending}
        className="py-1 pl-4 text-2xl font-medium leading-[3rem] data-[disabled=true]:opacity-50"
      >
        Search Inspiration
      </h1>

      <div>
        <h2
          data-disabled={isHistoryPending}
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
            disabled={isHistoryPending}
            error={form.fields.orderBy.error}
          />

          <FieldSelect
            placeholder="Order By Dir"
            meta={form.fields.orderByDir.meta}
            setValue={form.setValue.bind(form, "orderByDir")}
            setMeta={form.setMeta.bind(form, "orderByDir")}
            disabled={isHistoryPending}
            error={form.fields.orderByDir.error}
          />
        </div>
      </div>

      <FieldTextArea
        label="Content"
        meta={form.fields.content.meta}
        setValue={form.setValue.bind(form, "content")}
        setMeta={form.setMeta.bind(form, "content")}
        disabled={isHistoryPending}
        error={form.fields.content.error}
        acceptIndeterminate
      />

      <div>
        <h2
          data-disabled={isHistoryPending}
          className="py-1 pl-4 text-lg font-medium leading-10 data-[disabled=true]:opacity-50"
        >
          Date
        </h2>

        <FieldComparisonDate
          title="Date"
          meta={form.fields.date.meta}
          setValue={form.setValue.bind(form, "date")}
          setMeta={form.setMeta.bind(form, "date")}
          disabled={isHistoryPending}
          error={form.fields.date.error}
          acceptIndeterminate
        />
      </div>

      <div>
        <h2
          data-disabled={isHistoryPending}
          className="py-1 pl-4 text-lg font-medium leading-10 data-[disabled=true]:opacity-50"
        >
          Highlight
        </h2>

        <FieldCheckbox
          label="Highlight"
          meta={form.fields.highlight.meta}
          setValue={form.setValue.bind(form, "highlight")}
          setMeta={form.setMeta.bind(form, "highlight")}
          disabled={isHistoryPending}
          error={form.fields.highlight.error}
          acceptIndeterminate
        />
      </div>

      <FieldDynamicSelect
        title="Related BigPaints"
        meta={form.fields.related_big_paints_ids.meta}
        setValue={form.setValue.bind(form, "related_big_paints_ids")}
        setMeta={form.setMeta.bind(form, "related_big_paints_ids")}
        disabled={isHistoryPending}
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
        disabled={isHistoryPending}
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
