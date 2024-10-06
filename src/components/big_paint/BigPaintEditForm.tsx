"use client";
import { deleteBigPaintAction } from "@/actions/deleteBigPaintAction";
import { editBigPaintAction } from "@/actions/editBigPaintAction";
import { fetchBigPaintAction } from "@/actions/fetchBigPaintAction";
import { searchBigPaintsAction } from "@/actions/searchBigPaintsAction";
import { DateInput } from "@/components/DateInput";
import { SearchSelect } from "@/components/SearchSelect";
import { TextInput } from "@/components/TextInput";
import { editBigPaintSchema } from "@/schemas/editBigPaintSchema";
import { useEditBigPaint } from "@/stores/useEditBigPaint";
import { transformDate } from "@/utils/date";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { startTransition, useActionState, useEffect } from "react";

export default function BigPaintEditForm({ id }: { id: string }) {
  const queryClient = useQueryClient();

  const form = useEditBigPaint();

  const {
    status: queryStatus,
    data: queryData,
    error: queryError,
    refetch: fetch,
  } = useQuery({
    queryKey: ["big_paints", id],
    queryFn: ({ queryKey }) => fetchBigPaintAction(queryKey[1]),
    enabled: false,
  });

  const editActionBind = editBigPaintAction.bind(null, queryData?.id!);

  const [, editAction, isEditActionPending] = useActionState(
    editActionBind,
    void 0,
  );

  const deleteActionBind = deleteBigPaintAction.bind(null, queryData?.id!);

  const [, deleteAction, isDeleteActionPending] = useActionState(
    deleteActionBind,
    void 0,
  );

  useEffect(() => {
    fetch().then((result) => {
      const queryData = result.data;
      if (queryData) {
        form.set({
          name: queryData.name,
          related_big_paints_ids: queryData.relatedBigPaints.map((it) => it.id),
          date: transformDate(queryData.date),
        });
      }
    });
  }, [fetch, id]);

  useEffect(() => {
    if (!isEditActionPending)
      queryClient.invalidateQueries({ queryKey: ["big_paints"] });
  }, [isEditActionPending]);

  useEffect(() => {
    if (!isDeleteActionPending)
      queryClient.invalidateQueries({ queryKey: ["big_paints"] });
  }, [isDeleteActionPending]);

  if (queryStatus === "error") throw queryError;

  if (queryStatus === "pending") return <span>pending</span>;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!form.isInvalid)
          startTransition(() => {
            editAction(form.values());
          });
      }}
      className="space-y-6"
    >
      <div className="flex items-center justify-end gap-4 p-4">
        <button
          onClick={() => {
            if (confirm("Are you sure?")) {
              startTransition(() => {
                deleteAction();
              });
            }
          }}
          disabled={isDeleteActionPending || isEditActionPending}
          type="button"
          className="max-w-32 overflow-hidden text-ellipsis whitespace-nowrap rounded bg-red-800 px-3 ring-1 ring-red-600 hover:bg-red-600 hover:ring-0 active:bg-red-700 active:ring-1"
        >
          {isDeleteActionPending ? "Deleting..." : "Delete"}
        </button>
        <button
          type="submit"
          className="max-w-32 overflow-hidden text-ellipsis whitespace-nowrap rounded bg-blue-500 px-3 ring-1 ring-blue-300 hover:bg-blue-300 hover:ring-0 active:bg-blue-400 active:ring-1"
          disabled={
            isEditActionPending || isDeleteActionPending || form.isInvalid
          }
        >
          {isEditActionPending ? "Saving..." : "Save"}
        </button>
      </div>
      <div>
        <TextInput
          value={form.name || ""}
          setValue={(value) => form.set({ name: value })}
          validation={editBigPaintSchema.shape.name}
          formPushError={form.pushError}
          formPopError={form.popError}
          disabled={isEditActionPending || isDeleteActionPending}
        />
        <div className="flex min-h-9 items-center justify-end pr-2">
          <DateInput
            value={form.date || ""}
            setValue={(value) => form.set({ date: value })}
            validation={editBigPaintSchema.shape.date}
            formPushError={form.pushError}
            formPopError={form.popError}
            disabled={isEditActionPending || isDeleteActionPending}
          />
        </div>
      </div>
      <SearchSelect
        formPushError={form.pushError}
        formPopError={form.popError}
        defaultValue={queryData.relatedBigPaints}
        value={form.related_big_paints_ids || []}
        setValue={(value) => form.set({ related_big_paints_ids: value })}
        validation={editBigPaintSchema.shape.related_big_paints_ids}
        searchAction={searchBigPaintsAction}
        title="Related BigPaints"
        selectId={(value) => value.id}
        selectContent={(value) => value.name}
        disabled={isEditActionPending || isDeleteActionPending}
        blacklist={[{ name: "", id }]}
      />
    </form>
  );
}
