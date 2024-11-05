"use client";
import { deleteBigPaintAction } from "@/actions/deleteBigPaintAction";
import { editBigPaintAction } from "@/actions/editBigPaintAction";
import { fetchBigPaintAction } from "@/actions/fetchBigPaintAction";
import { searchBigPaintAction } from "@/actions/searchBigPaintAction";
import Button from "@/components/Button";
import { DateInput } from "@/components/DateInput";
import { SearchSelect } from "@/components/SearchSelect";
import { TextInput } from "@/components/TextInput";
import { editBigPaintFormSchema } from "@/schemas/editBigPaintFormSchema";
import { useEditBigPaintForm } from "@/stores/useEditBigPaintForm";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { startTransition, useActionState, useEffect } from "react";

export default function BigPaintEditForm({ id }: { id: string }) {
  const queryClient = useQueryClient();

  const form = useEditBigPaintForm();

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
          date: queryData.date,
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
        <Button
          onClick={() => {
            if (confirm("Are you sure?")) {
              startTransition(() => {
                deleteAction();
              });
            }
          }}
          disabled={isDeleteActionPending || isEditActionPending}
          color="danger"
        >
          {isDeleteActionPending ? "Deleting..." : "Delete"}
        </Button>
        <Button
          type="submit"
          color="accent"
          disabled={
            isEditActionPending || isDeleteActionPending || form.isInvalid
          }
        >
          {isEditActionPending ? "Saving..." : "Save"}
        </Button>
      </div>
      <div>
        <TextInput
          value={form.name!}
          setValue={(value) => form.set({ name: value })}
          validation={editBigPaintFormSchema.shape.name}
          formPushError={form.pushError}
          formPopError={form.popError}
          disabled={isEditActionPending || isDeleteActionPending}
        />
        <div className="flex min-h-9 items-center justify-end pr-2">
          <DateInput
            value={form.date!}
            setValue={(value) => form.set({ date: value })}
            validation={editBigPaintFormSchema.shape.date}
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
        value={form.related_big_paints_ids!}
        setValue={(value) => form.set({ related_big_paints_ids: value })}
        validation={editBigPaintFormSchema.shape.related_big_paints_ids}
        searchAction={(prevState, { query }) =>
          searchBigPaintAction({
            name: query,
            orderBy: "date",
            orderByDir: "asc",
            date: undefined,
            related_big_paints_ids: undefined,
          }).then((res) =>
            res.data.map((item) => ({
              name: item.name,
              id: item.id,
            })),
          )
        }
        title="Related BigPaints"
        selectId={(value) => value.id}
        selectContent={(value) => value.name}
        disabled={isEditActionPending || isDeleteActionPending}
        blacklist={[{ name: "", id }]}
      />
    </form>
  );
}
