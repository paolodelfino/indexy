"use client";

import { searchBigPaintAction } from "@/actions/searchBigPaintAction";
import updateBigPaintHistoryAction from "@/actions/updateBigPaintHistoryAction";
import Button from "@/components/Button";
import FormDateComparison from "@/components/form/FormDateComparison";
import FormSelect from "@/components/form/FormSelect";
import FormSelectSearch from "@/components/form/FormSelectSearch";
import FormText from "@/components/form/FormText";
import { Cloud, InformationCircle } from "@/components/icons";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/popover";
import useBigPaintHistoryQuery from "@/stores/useBigPaintHistoryQuery";
import { useSearchBigPaintForm } from "@/stores/useSearchBigPaintForm";
import { valuesToSearchParams } from "@/utils/url";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function BigPaintSearchForm() {
  const form = useSearchBigPaintForm();
  const router = useRouter();
  const [isHistoryPending, setIsHistoryPending] = useState(false);
  const invalidateBigPaintHistoryQuery = useBigPaintHistoryQuery(
    (state) => state.invalidate,
  );

  useEffect(() => {
    // TODO: Vedi se questo problema del cambio route si è risolto ora che non uso più quello schifo di query management
    form.setOnSubmit(async (form) => {
      setIsHistoryPending(true);

      const values = valuesToSearchParams(form.values());

      await updateBigPaintHistoryAction({ values, date: new Date() });

      invalidateBigPaintHistoryQuery(); // TODO: Non avevo pensato allo scenario in cui la funzione non finisce in tempo, siam sicuri che continua lo stesso?

      setIsHistoryPending(false);

      router.push(`/result/big_paint?${valuesToSearchParams(form.values())}`);
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
        Search BigPaint
      </h1>

      <div>
        <h2
          data-disabled={isHistoryPending}
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
            disabled={isHistoryPending}
            error={form.fields.orderBy.error}
          />

          <FormSelect
            placeholder="Order By Dir"
            meta={form.fields.orderByDir.meta}
            setValue={form.setValue.bind(form, "orderByDir")}
            setMeta={form.setMeta.bind(form, "orderByDir")}
            disabled={isHistoryPending}
            error={form.fields.orderByDir.error}
          />
        </div>
      </div>

      <FormText
        label="Name"
        meta={form.fields.name.meta}
        setValue={form.setValue.bind(form, "name")}
        setMeta={form.setMeta.bind(form, "name")}
        disabled={isHistoryPending}
        error={form.fields.name.error}
        acceptIndeterminate
      />

      <div>
        <h2
          data-disabled={isHistoryPending}
          className="py-1 pl-4 text-lg font-medium leading-10 data-[disabled=true]:opacity-50"
        >
          Date
        </h2>

        <FormDateComparison
          title="Date"
          meta={form.fields.date.meta}
          setValue={form.setValue.bind(form, "date")}
          setMeta={form.setMeta.bind(form, "date")}
          disabled={isHistoryPending}
          error={form.fields.date.error}
          acceptIndeterminate
        />
      </div>

      <FormSelectSearch
        title="Related BigPaints"
        meta={form.fields.related_big_paints_ids.meta}
        setValue={form.setValue.bind(form, "related_big_paints_ids")}
        setMeta={form.setMeta.bind(form, "related_big_paints_ids")}
        disabled={isHistoryPending}
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
    </div>
  );
}
