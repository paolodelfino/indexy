"use client";
import { deleteBigPaintAction } from "@/actions/deleteBigPaintAction";
import { editBigPaintAction } from "@/actions/editBigPaintAction";
import { fetchBigPaintAction } from "@/actions/fetchBigPaintAction";
import { searchBigPaintAction } from "@/actions/searchBigPaintAction";
import Button from "@/components/Button";
import FormDate from "@/components/form/FormDate";
import FormSelectSearch from "@/components/form/FormSelectSearch";
import FormText from "@/components/form/FormText";
import { InformationCircle } from "@/components/icons";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/popover";
import { useEditBigPaintForm } from "@/stores/useEditBigPaintForm";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// TODO: History (using versioning)

export default function BigPaintEditForm({ id }: { id: string }) {
  const router = useRouter();

  const queryClient = useQueryClient();

  const {
    status: queryStatus,
    // data: queryData,
    error: queryError,
    refetch: fetch,
  } = useQuery({
    queryKey: ["big_paints", id],
    queryFn: ({ queryKey }) => fetchBigPaintAction(queryKey[1]),
    enabled: false,
  });

  const [isDeleteFormPending, setIsDeleteFormPending] = useState(false);

  const [isEditFormPending, setIsEditFormPending] = useState(false);

  const form = useEditBigPaintForm();
  useEffect(() => {
    form.setOnSubmit(async (form) => {
      setIsEditFormPending(true);

      await editBigPaintAction(id, form.values());

      queryClient.invalidateQueries({ queryKey: ["big_paints"] });

      setIsEditFormPending(false);
    });
  }, [form.setOnSubmit]);

  useEffect(() => {
    if (id === form.meta.lastId) return;

    fetch().then((result) => {
      const queryData = result.data;
      if (queryData === undefined) return;

      form.setValues({
        name: queryData.name,
        related_big_paints_ids: queryData.relatedBigPaints.map((it) => it.id),
        date: queryData.date,
      });

      form.setMetas({
        related_big_paints_ids: {
          ...form.fields.related_big_paints_ids.default.meta,
          selectedItems: queryData.relatedBigPaints.map((it) => ({
            content: it.name,
            id: it.id,
          })),
        },
        date: {
          date: queryData.date,
          time: {
            hours: queryData.date.getHours(),
            minutes: queryData.date.getMinutes(),
            seconds: queryData.date.getSeconds(),
            milliseconds: queryData.date.getMilliseconds(),
          },
        },
        name: queryData.name,
      });

      form.setFormMeta({ lastId: queryData.id });
    });
  }, [id]);

  if (queryStatus === "error") throw queryError;

  if (queryStatus === "pending") return <span>pending</span>;

  return (
    <div className="space-y-6">
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

              await deleteBigPaintAction({ id });

              queryClient.invalidateQueries({ queryKey: ["big_paints"] });

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
        <FormText
          setValue={form.setValue.bind(form, "name")}
          setMeta={form.setMeta.bind(form, "name")}
          meta={form.fields.name.meta}
          error={form.fields.name.error}
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
        </div>
        <FormSelectSearch
          title="Related BigPaints"
          setValue={form.setValue.bind(form, "related_big_paints_ids")}
          setMeta={form.setMeta.bind(form, "related_big_paints_ids")}
          meta={form.fields.related_big_paints_ids.meta}
          error={form.fields.related_big_paints_ids.error}
          disabled={isEditFormPending || isDeleteFormPending}
          search={(_, { query }) =>
            searchBigPaintAction({
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
      </div>
    </div>
  );
}
