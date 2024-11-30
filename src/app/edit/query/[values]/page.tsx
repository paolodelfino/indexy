"use client";

import ActionDelete__Query from "@/actions/ActionDelete__Query";
import ActionEdit__Query from "@/actions/ActionEdit__Query";
import Button from "@/components/Button";
import FieldDate from "@/components/form_ui/FieldDate";
import FieldText from "@/components/form_ui/FieldText";
import { InformationCircle } from "@/components/icons";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/popover";
import schemaQuery__Edit__Params from "@/schemas/schemaQuery__Edit__Params";
import useFormEdit__Query from "@/stores/forms/useFormEdit__Query";
import useQueryQuery__Edit from "@/stores/queries/useQueryQuery__Edit";
import useQueryQuery__Query from "@/stores/queries/useQueryQuery__Query";
import useQueryQuery__View from "@/stores/queries/useQueryQuery__View";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function FormEdit__Query({
  params,
}: {
  params: { values: string };
}) {
  const { values: valuesStr } = useMemo(
    () => schemaQuery__Edit__Params.parse(params),
    [params],
  );

  const query = useQueryQuery__Edit();
  const form = useFormEdit__Query();
  const router = useRouter();

  useEffect(() => {
    query.active();
    return () => query.inactive();
  }, []);

  useEffect(() => {
    if (valuesStr !== form.meta.lastValues) {
      form.setFormMeta({ lastValues: valuesStr });

      query.fetch(valuesStr).then((data) => {
        form.setMetas({
          name: data.name,
          date: {
            date: data.date,
            time: {
              hours: data.date.getHours(),
              minutes: data.date.getMinutes(),
              seconds: data.date.getSeconds(),
              milliseconds: data.date.getMilliseconds(),
            },
          },
        });
      });
    }
  }, [valuesStr]);

  const invalidate__QueryQuery__View = useQueryQuery__View(
    (state) => state.invalidate,
  );
  const invalidate__QueryQuery__Query = useQueryQuery__Query(
    (state) => state.invalidate,
  );

  const [isDeleteFormPending, setIsDeleteFormPending] = useState(false);
  const [isEditFormPending, setIsEditFormPending] = useState(false);

  useEffect(() => {
    form.setOnSubmit(async (form) => {
      setIsEditFormPending(true);

      const values = form.values();

      await ActionEdit__Query(valuesStr, values);

      // invalidate__QueryQuery__Edit(); // NOTE: Questo avrebbe senso se avessi più pagine aperte e fossero connesse
      invalidate__QueryQuery__View();
      invalidate__QueryQuery__Query();

      setIsEditFormPending(false);
    });
  }, [form.setOnSubmit, valuesStr]);

  return (
    <div className="space-y-6 pb-32">
      <div className="flex items-center justify-end gap-4 p-4">
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
          onClick={async () => {
            if (confirm("Are you sure?")) {
              setIsDeleteFormPending(true);

              await ActionDelete__Query({
                values: valuesStr,
              });

              // invalidate__QueryQuery__Edit(); // NOTE: Questo avrebbe più senso se avessi più pagine aperte e fossero connesse o se usassi useQueryQuery__Edit da altre parti
              invalidate__QueryQuery__View();
              invalidate__QueryQuery__Query();

              setIsDeleteFormPending(false);

              router.back();
            }
          }}
          disabled={isDeleteFormPending || isEditFormPending}
          color="danger"
        >
          {isDeleteFormPending ? "Deleting..." : "Delete"}
        </Button>
        <Button
          type="submit"
          color="accent"
          disabled={isEditFormPending || isDeleteFormPending || form.isInvalid}
          onClick={form.submit}
        >
          {isEditFormPending ? "Saving..." : "Save"}
        </Button>
      </div>
      <FieldText
        label="Name"
        setValue={form.setValue.bind(form, "name")}
        setMeta={form.setMeta.bind(form, "name")}
        meta={form.fields.name.meta}
        error={form.fields.name.error}
        disabled={isEditFormPending || isDeleteFormPending}
      />
      <div>
        <h2
          data-disabled={isEditFormPending || isDeleteFormPending}
          className="py-1 pl-4 text-lg font-medium leading-10 data-[disabled=true]:opacity-50"
        >
          Date
        </h2>

        <FieldDate
          placeholder="Date"
          setValue={form.setValue.bind(form, "date")}
          setMeta={form.setMeta.bind(form, "date")}
          meta={form.fields.date.meta!}
          error={form.fields.date.error}
          disabled={isEditFormPending || isDeleteFormPending}
        />
      </div>
    </div>
  );
}
