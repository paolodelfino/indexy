"use client";

import ActionDelete__BigPaint from "@/actions/ActionDelete__BigPaint";
import ActionEdit__BigPaint from "@/actions/ActionEdit__BigPaint";
import ActionSearch__BigPaint from "@/actions/ActionSearch__BigPaint";
import Button from "@/components/Button";
import FieldDate from "@/components/form_ui/FieldDate";
import FieldDynamicSelect from "@/components/form_ui/FieldDynamicSelect";
import FieldText from "@/components/form_ui/FieldText";
import { InformationCircle } from "@/components/icons";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/popover";
import useFormEdit__BigPaint from "@/stores/forms/useFormEdit__BigPaint";
import useQueryBigPaints__Search from "@/stores/queries/useQueryBigPaints__Search";
import useQueryBigPaints__View from "@/stores/queries/useQueryBigPaints__View";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function FormEdit__BigPaint({
  data,
}: {
  data: {
    id: string;
    name: string;
    date: Date;
    relatedBigPaints: { id: string; name: string }[];
  };
}) {
  const router = useRouter();

  const invalidateQueryBigPaints__View = useQueryBigPaints__View(
    (state) => state.invalidate,
  );
  const invalidateQueryBigPaints__Search = useQueryBigPaints__Search(
    (state) => state.invalidate,
  );

  const [isDeleteFormPending, setIsDeleteFormPending] = useState(false);
  const [isEditFormPending, setIsEditFormPending] = useState(false);

  const form = useFormEdit__BigPaint();
  useEffect(() => {
    form.setOnSubmit(async (form) => {
      setIsEditFormPending(true);

      // await (await import("@/actions/ActionEdit__BigPaint")).ActionEdit__BigPaint(data.id, form.values())
      await ActionEdit__BigPaint(data.id, form.values());

      invalidateQueryBigPaints__View();
      invalidateQueryBigPaints__Search();

      setIsEditFormPending(false);
    });
  }, [form.setOnSubmit, data]);

  useEffect(() => {
    // TODO: Based on this condition, if client-side re-routing here leads to server side refetch, then we should maybe use query.
    // Also take into account the scenario in which the entry, when you re-route, it's deleted. Furthermore more, I see some data transferring in the network tab
    // when client-side routing even and/or at least to the same (cached) entry.
    if (data.id !== form.meta.lastId) {
      form.setMetas({
        related_big_paints_ids: {
          ...form.fields.related_big_paints_ids.default.meta,
          selectedItems: data.relatedBigPaints.map((it) => ({
            content: it.name,
            id: it.id,
          })),
        },
        date: {
          date: data.date,
          time: {
            hours: data.date.getHours(),
            minutes: data.date.getMinutes(),
            seconds: data.date.getSeconds(),
            milliseconds: data.date.getMilliseconds(),
          },
        },
        name: data.name,
      });

      form.setFormMeta({ lastId: data.id });
    }
  }, [data]);

  return (
    <div className="space-y-6 pb-16">
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

              await ActionDelete__BigPaint({ id: data.id });

              invalidateQueryBigPaints__View();
              invalidateQueryBigPaints__Search();

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
      <div>
        <FieldText
          setValue={form.setValue.bind(form, "name")}
          setMeta={form.setMeta.bind(form, "name")}
          meta={form.fields.name.meta}
          error={form.fields.name.error}
          disabled={isEditFormPending || isDeleteFormPending}
        />
        <div className="flex min-h-9 items-center justify-end pr-2">
          <FieldDate
            placeholder="Date"
            setValue={form.setValue.bind(form, "date")}
            setMeta={form.setMeta.bind(form, "date")}
            meta={form.fields.date.meta!}
            error={form.fields.date.error}
            disabled={isEditFormPending || isDeleteFormPending}
          />
        </div>
        <FieldDynamicSelect
          title="Related BigPaints"
          setValue={form.setValue.bind(form, "related_big_paints_ids")}
          setMeta={form.setMeta.bind(form, "related_big_paints_ids")}
          meta={form.fields.related_big_paints_ids.meta}
          error={form.fields.related_big_paints_ids.error}
          disabled={isEditFormPending || isDeleteFormPending}
          // TODO: Maybe use query to handle invalidations
          search={(_, { query }) =>
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
          blacklist={[data.id]}
        />
      </div>
    </div>
  );
}
