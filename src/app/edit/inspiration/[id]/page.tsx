"use client";

import ActionDelete__Inspiration from "@/actions/ActionDelete__Inspiration";
import ActionEdit__Inspiration from "@/actions/ActionEdit__Inspiration";
import ActionQuery__BigPaint from "@/actions/ActionQuery__BigPaint";
import ActionQuery__Inspiration from "@/actions/ActionQuery__Inspiration";
import AEditor from "@/components/AEditor";
import Button from "@/components/Button";
import FieldCheckbox from "@/components/form_ui/FieldCheckbox";
import FieldDate from "@/components/form_ui/FieldDate";
import FieldDynamicSelect from "@/components/form_ui/FieldDynamicSelect";
import { InformationCircle, Star } from "@/components/icons";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/popover";
import schemaInspiration__Edit__Params from "@/schemas/schemaInspiration__Edit__Params";
import useFormEdit__Inspiration from "@/stores/forms/useFormEdit__Inspiration";
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
    () => schemaInspiration__Edit__Params.parse(params),
    [params],
  );

  const router = useRouter();
  const query = useQueryInspiration__Edit();

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
    // TODO: Ok, ho fatto il check e, come pensavo, react, al mount, chiama di nuovo tutti gli effect e il re-mount avviene ovviamente anche col cambio route client-side. Quindi dobbiamo mettere un guard (anche da altre parti)

    console.log("probably query.data has changed", query.data); // TODO: Take a look (anche per /edit/query)

    if (query.data !== undefined) {
      const maxN = query.data.resources.reduce((max, value) => {
        return value.n > max ? value.n : max;
      }, 0);
      form.setMetas({
        resources: {
          items: query.data.resources.map((it) => {
            // console.log(it.buff);
            return {
              n: it.n,
              sha256: it.sha256,
              type: it.type,
              unused: true,
              buff: it.buff,
              blob_url: URL.createObjectURL(new Blob([it.buff])),
            };
          }),
          n: maxN,
        },
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
        content: query.data.content,
        highlight: query.data.highlight,
      });
    }
  }, [query.data]);

  const [isDeleteFormPending, setIsDeleteFormPending] = useState(false);
  const [isEditFormPending, setIsEditFormPending] = useState(false); // TODO: Implement form.isPending

  const invalidate__QueryBigPaint__Edit = useQueryBigPaint__Edit(
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

  const form = useFormEdit__Inspiration();
  useEffect(() => {
    form.setOnSubmit(async (form) => {
      setIsEditFormPending(true);

      // TODO: Qui assumiamo che il valore corrente di value è sempre associato al valore corrente di meta
      const unused = form.fields.resources.meta.items.filter((it) => it.unused);
      if (unused.length > 0) alert(`${unused.length} unused assets`);
      else {
        await ActionEdit__Inspiration(id, form.values());

        invalidate__QueryBigPaint__Edit();
        // invalidate__QueryInspiration__Edit(); // NOTE: Questo avrebbe senso se avessi più pagine aperte e fossero connesse
        invalidate__QueryBigPaint__Pool();
        invalidate__QueryBigPaint__Query();
        invalidate__QueryInspiration__Pool();
        invalidate__QueryInspiration__Query();
      }

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

              await ActionDelete__Inspiration({ id: id });

              invalidate__QueryBigPaint__Edit();
              // invalidate__QueryInspiration__Edit(); // NOTE: Questo avrebbe più senso se avessi più pagine aperte e fossero connesse o se usassi useQueryInspiration__Edit da altre parti
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
        <AEditor
          meta={form.fields.resources.meta}
          setMeta={form.setMeta.bind(form, "resources")}
          setValue={form.setValue.bind(form, "resources")}
          error={form.fields.resources.error}
          meta__FieldTextArea={form.fields.content.meta}
          setMeta__FieldTextArea={form.setMeta.bind(form, "content")}
          setValue__FieldTextArea={form.setValue.bind(form, "content")}
          error__FieldTextArea={form.fields.content.error}
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
          <FieldCheckbox
            setValue={form.setValue.bind(form, "highlight")}
            setMeta={form.setMeta.bind(form, "highlight")}
            meta={form.fields.highlight.meta!}
            error={form.fields.highlight.error}
            disabled={isEditFormPending || isDeleteFormPending}
            classNames={{ button: "pl-4" }}
            checkedIcon={<Star fill="currentColor" />}
            uncheckedIcon={<Star />}
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
        blacklist={[id]}
      />
    </div>
  );
}
