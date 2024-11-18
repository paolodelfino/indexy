"use client";

import { deleteInspirationAction } from "@/actions/deleteInspirationAction";
import { editInspirationAction } from "@/actions/editInspirationAction";
import { searchBigPaintAction } from "@/actions/searchBigPaintAction";
import { searchInspirationAction } from "@/actions/searchInspirationAction";
import Button from "@/components/Button";
import FormCheckbox from "@/components/form/FormCheckbox";
import FormDate from "@/components/form/FormDate";
import FormSelectSearch from "@/components/form/FormSelectSearch";
import FormTextArea from "@/components/form/FormTextArea";
import { InformationCircle, Star } from "@/components/icons";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/popover";
import { useEditInspirationForm } from "@/stores/useEditInspirationForm";
import useInspirationSearchQuery from "@/stores/useInspirationSearchQuery";
import useInspirationViewQuery from "@/stores/useInspirationViewQuery";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function InspirationEditFormView({
  data,
}: {
  data: {
    id: string;
    content: string;
    highlight: boolean;
    date: Date;
    relatedBigPaints: { id: string; name: string }[];
    relatedInspirations: { id: string; content: string }[];
  };
}) {
  const router = useRouter();

  const [isDeleteFormPending, setIsDeleteFormPending] = useState(false);
  const [isEditFormPending, setIsEditFormPending] = useState(false);

  const invalidateInspirationViewQuery = useInspirationViewQuery(
    (state) => state.invalidate,
  );
  const invalidateInspirationSearchQuery = useInspirationSearchQuery(
    (state) => state.invalidate,
  );

  const form = useEditInspirationForm();
  useEffect(() => {
    form.setOnSubmit(async (form) => {
      setIsEditFormPending(true);

      await editInspirationAction(data.id, form.values());

      invalidateInspirationViewQuery();
      invalidateInspirationSearchQuery();

      setIsEditFormPending(false);
    });
  }, [form.setOnSubmit, data]);

  useEffect(() => {
    if (data.id !== form.meta.lastId) {
      form.setMetas({
        related_big_paints_ids: {
          ...form.fields.related_big_paints_ids.default.meta,
          selectedItems: data.relatedBigPaints.map((it) => ({
            content: it.name,
            id: it.id,
          })),
        },
        related_inspirations_ids: {
          ...form.fields.related_inspirations_ids.default.meta,
          selectedItems: data.relatedInspirations,
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
        content: data.content,
        highlight: data.highlight,
      });

      form.setFormMeta({ lastId: data.id });
    }
  }, [data]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end gap-4 p-4">
        <Button
          onClick={async () => {
            if (confirm("Are you sure?")) {
              setIsDeleteFormPending(true);

              await deleteInspirationAction({ id: data.id });

              invalidateInspirationViewQuery();
              invalidateInspirationSearchQuery();

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
        <FormTextArea
          setValue={form.setValue.bind(form, "content")}
          setMeta={form.setMeta.bind(form, "content")}
          meta={form.fields.content.meta}
          error={form.fields.content.error}
          disabled={isEditFormPending || isDeleteFormPending}
        />
        <div className="flex min-h-9 items-center justify-end pr-2">
          <FormDate
            placeholder="Date"
            setValue={form.setValue.bind(form, "date")}
            setMeta={form.setMeta.bind(form, "date")}
            meta={form.fields.date.meta!}
            error={form.fields.date.error}
            disabled={isEditFormPending || isDeleteFormPending}
          />
          <FormCheckbox
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
      <FormSelectSearch
        title="Related BigPaints"
        setValue={form.setValue.bind(form, "related_big_paints_ids")}
        setMeta={form.setMeta.bind(form, "related_big_paints_ids")}
        meta={form.fields.related_big_paints_ids.meta}
        error={form.fields.related_big_paints_ids.error}
        disabled={isEditFormPending || isDeleteFormPending}
        search={(_, { query }) =>
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
        setValue={form.setValue.bind(form, "related_inspirations_ids")}
        setMeta={form.setMeta.bind(form, "related_inspirations_ids")}
        meta={form.fields.related_inspirations_ids.meta}
        error={form.fields.related_inspirations_ids.error}
        disabled={isEditFormPending || isDeleteFormPending}
        search={(_, { query }) =>
          searchInspirationAction(null, null, {
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
        blacklist={[data.id]}
      />
    </div>
  );
}
