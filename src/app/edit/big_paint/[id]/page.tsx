"use client";

import ActionDelete__BigPaint from "@/actions/ActionDelete__BigPaint";
import ActionEdit__BigPaint from "@/actions/ActionEdit__BigPaint";
import ActionQuery__BigPaint from "@/actions/ActionQuery__BigPaint";
import ActionQuery__Inspiration from "@/actions/ActionQuery__Inspiration";
import Button from "@/components/Button";
import FieldDate from "@/components/form_ui/FieldDate";
import FieldDynamicSelect from "@/components/form_ui/FieldDynamicSelect";
import FieldText from "@/components/form_ui/FieldText";
import { InformationCircle } from "@/components/icons";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/popover";
import schemaBigPaint__Edit__Params from "@/schemas/schemaBigPaint__Edit__Params";
import useFormEdit__BigPaint from "@/stores/forms/useFormEdit__BigPaint";
import useQueryBigPaint__Edit from "@/stores/queries/useQueryBigPaint__Edit";
import useQueryBigPaint__Pool from "@/stores/queries/useQueryBigPaint__Pool";
import useQueryBigPaint__Query from "@/stores/queries/useQueryBigPaint__Query";
import useQueryInspiration__Edit from "@/stores/queries/useQueryInspiration__Edit";
import useQueryInspiration__Pool from "@/stores/queries/useQueryInspiration__Pool";
import useQueryInspiration__Query from "@/stores/queries/useQueryInspiration__Query";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

// TODO: Vedi che succede quando visiti un'inspiration che non ci sta (anche in client-side routing) e cosa succede quando elimini una

export default function Page({ params }: { params: { id: string } }) {
  const { id } = useMemo(
    () => schemaBigPaint__Edit__Params.parse(params),
    [params],
  );

  const router = useRouter();
  const query = useQueryBigPaint__Edit();

  useEffect(() => {
    query.active();
    return () => query.inactive();
  }, []);

  useEffect(() => {
    if (id !== form.meta.lastId) {
      form.setFormMeta({ lastId: id });

      query.fetch(id);
    }
  }, [id]);

  useEffect(() => {
    console.log("probably query.data has changed", query.data); // TODO: Take a look

    if (query.data !== undefined)
      form.setMetas({
        related_big_paints_ids: {
          selectedItems: query.data.relatedBigPaints.map((it) => ({
            content: it.name,
            id: it.id,
          })),
        },
        related_inspirations_ids: {
          selectedItems: query.data.relatedInspirations,
        },
        date: {
          date: query.data.date,
          time: {
            hours: query.data.date.getHours(),
            minutes: query.data.date.getMinutes(),
            seconds: query.data.date.getSeconds(),
            milliseconds: query.data.date.getMilliseconds(),
          },
        },
        name: query.data.name,
      });
  }, [query.data]);

  const [isDeleteFormPending, setIsDeleteFormPending] = useState(false);
  const [isEditFormPending, setIsEditFormPending] = useState(false); // TODO: Implement form.isPending

  const invalidate__QueryInspiration__Edit = useQueryInspiration__Edit(
    (state) => state.invalidate,
  );
  const invalidate__QueryBigPaint__Pool = useQueryBigPaint__Pool(
    (state) => state.invalidate,
  );
  const invalidate__QueryBigPaint__Query = useQueryBigPaint__Query(
    (state) => state.invalidate,
  );
  const invalidate__QueryInspiration__Pool = useQueryInspiration__Pool(
    (state) => state.invalidate,
  );
  const invalidate__QueryInspiration__Query = useQueryInspiration__Query(
    (state) => state.invalidate,
  );

  const form = useFormEdit__BigPaint();
  useEffect(() => {
    form.setOnSubmit(async (form) => {
      setIsEditFormPending(true);

      await ActionEdit__BigPaint(id, form.values());

      // invalidate__QueryBigPaint__Edit(); // NOTE: Questo avrebbe senso se avessi più pagine aperte e fossero connesse
      invalidate__QueryInspiration__Edit();
      invalidate__QueryBigPaint__Pool();
      invalidate__QueryBigPaint__Query();
      invalidate__QueryInspiration__Pool();
      invalidate__QueryInspiration__Query();

      setIsEditFormPending(false);
    });
  }, [form.setOnSubmit, id]);

  return (
    <div className="space-y-6 pb-32">
      <div className="flex items-center justify-end gap-4 p-4">
        <Button
          onClick={async () => {
            if (confirm("Are you sure?")) {
              setIsDeleteFormPending(true);

              await ActionDelete__BigPaint({ id: id });

              // invalidate__QueryBigPaint__Edit(); // NOTE: Questo avrebbe più senso se avessi più pagine aperte e fossero connesse o se usassi useQueryBigPaint__Edit da altre parti
              invalidate__QueryInspiration__Edit();
              invalidate__QueryBigPaint__Pool();
              invalidate__QueryBigPaint__Query();
              invalidate__QueryInspiration__Pool();
              invalidate__QueryInspiration__Query();

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
          color="accent"
          disabled={isEditFormPending || isDeleteFormPending || form.isInvalid}
          onClick={form.submit}
        >
          {isEditFormPending ? "Saving..." : "Save"}
        </Button>
      </div>
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
      <div>
        <FieldText
          meta={form.fields.name.meta}
          setMeta={form.setMeta.bind(form, "name")}
          setValue={form.setValue.bind(form, "name")}
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
      </div>
      <FieldDynamicSelect
        title="Related BigPaints"
        setValue={form.setValue.bind(form, "related_big_paints_ids")}
        setMeta={form.setMeta.bind(form, "related_big_paints_ids")}
        meta={form.fields.related_big_paints_ids.meta}
        error={form.fields.related_big_paints_ids.error}
        disabled={isEditFormPending || isDeleteFormPending}
        search={(_, { query }) =>
          ActionQuery__BigPaint(null, null, {
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
        blacklist={[id]}
      />
      <FieldDynamicSelect
        title="Related Inspirations"
        setValue={form.setValue.bind(form, "related_inspirations_ids")}
        setMeta={form.setMeta.bind(form, "related_inspirations_ids")}
        meta={form.fields.related_inspirations_ids.meta}
        error={form.fields.related_inspirations_ids.error}
        disabled={isEditFormPending || isDeleteFormPending}
        search={(_, { query }) =>
          ActionQuery__Inspiration(null, null, {
            // TODO: Add select to avoid bloating responses and also remapping oppure usa un'altra action
            content: query,
            orderBy: "date",
            orderByDir: "asc",
            date: undefined,
            highlight: undefined,
            related_big_paints_ids: undefined,
            related_inspirations_ids: undefined,
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
