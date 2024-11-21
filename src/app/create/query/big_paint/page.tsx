"use client";

import ActionCreate__Query from "@/actions/ActionCreate__Query";
import ActionSearch__BigPaint from "@/actions/ActionSearch__BigPaint";
import Button from "@/components/Button";
import FieldComparisonDate from "@/components/form_ui/FieldComparisonDate";
import FieldDynamicSelect from "@/components/form_ui/FieldDynamicSelect";
import FieldSelect from "@/components/form_ui/FieldSelect";
import FieldText from "@/components/form_ui/FieldText";
import { Cloud, InformationCircle } from "@/components/icons";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/popover";
import useFormSearch__BigPaint from "@/stores/forms/useFormSearch__BigPaint";
import useQueryQueries__View from "@/stores/queries/useQueryQueries__View";
import { valuesToSearchParams } from "@/utils/url";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const form = useFormSearch__BigPaint();
  const router = useRouter();
  const [isFormPending, setIsFormPending] = useState(false);
  const invalidateQueryQueries__View = useQueryQueries__View(
    (state) => state.invalidate,
  );

  useEffect(() => {
    // TODO: Vedi se questo problema del cambio route si è risolto ora che non uso più quello schifo di query management
    form.setOnSubmit(async (form) => {
      setIsFormPending(true);

      await ActionCreate__Query({
        values: decodeURIComponent(valuesToSearchParams(form.values())),
        category: "big_paint",
        name: "Untitled",
      });
      invalidateQueryQueries__View(); // TODO: Non avevo pensato allo scenario in cui la funzione non finisce in tempo, siam sicuri che continua lo stesso?

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
          disabled={isFormPending || form.isInvalid}
          onClick={() =>
            router.push(
              `/${valuesToSearchParams(form.values())}/query/big_paint`,
            )
          }
        >
          Search
        </Button>

        <Button
          color="accent"
          disabled={isFormPending || form.isInvalid}
          onClick={form.submit}
        >
          {isFormPending ? "Creating..." : "Create"}
        </Button>
      </div>

      <h1
        data-disabled={isFormPending}
        className="py-1 pl-4 text-2xl font-medium leading-[3rem] data-[disabled=true]:opacity-50"
      >
        Search BigPaint
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

      <FieldText
        label="Name"
        meta={form.fields.name.meta}
        setValue={form.setValue.bind(form, "name")}
        setMeta={form.setMeta.bind(form, "name")}
        disabled={isFormPending}
        error={form.fields.name.error}
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
    </div>
  );
}