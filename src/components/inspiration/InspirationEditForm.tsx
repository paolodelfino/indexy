"use client";
import { deleteInspirationAction } from "@/actions/deleteInspirationAction";
import { editInspirationAction } from "@/actions/editInspirationAction";
import { fetchInspirationAction } from "@/actions/fetchInspirationAction";
import { searchBigPaintAction } from "@/actions/searchBigPaintAction";
import { searchInspirationAction } from "@/actions/searchInspirationAction";
import Button from "@/components/Button";
import { CheckboxInput } from "@/components/CheckboxInput";
import { DateInput } from "@/components/DateInput";
import { Star } from "@/components/icons";
import { SearchSelect } from "@/components/SearchSelect";
import { TextInput } from "@/components/TextInput";
import { editInspirationFormSchema } from "@/schemas/editInspirationFormSchema";
import { useEditInspirationForm } from "@/stores/useEditInspirationForm";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { startTransition, useActionState, useEffect } from "react";

export default function InspirationEditForm({ id }: { id: string }) {
  const queryClient = useQueryClient();

  const form = useEditInspirationForm();

  const {
    status: queryStatus,
    data: queryData,
    error: queryError,
    refetch: fetch,
  } = useQuery({
    queryKey: ["inspirations", id],
    queryFn: ({ queryKey }) => fetchInspirationAction(queryKey[1]),
    enabled: false,
  });

  const editActionBind = editInspirationAction.bind(null, queryData?.id!);

  const [, editAction, isEditActionPending] = useActionState(
    editActionBind,
    void 0,
  );

  const deleteActionBind = deleteInspirationAction.bind(null, queryData?.id!);

  const [, deleteAction, isDeleteActionPending] = useActionState(
    deleteActionBind,
    void 0,
  );

  useEffect(() => {
    fetch().then((result) => {
      const queryData = result.data;
      if (queryData) {
        form.set({
          content: queryData.content,
          related_big_paints_ids: queryData.relatedBigPaints.map((it) => it.id),
          related_inspirations_ids: queryData.relatedInspirations.map(
            (it) => it.id,
          ),
          date: queryData.date,
          highlight: queryData.highlight,
        });
      }
    });
  }, [fetch, id]);

  useEffect(() => {
    if (!isEditActionPending)
      queryClient.invalidateQueries({ queryKey: ["inspirations"] });
  }, [isEditActionPending]);

  useEffect(() => {
    if (!isDeleteActionPending)
      queryClient.invalidateQueries({ queryKey: ["inspirations"] });
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
          multiple
          value={form.content!}
          setValue={(value) => form.set({ content: value })}
          validation={editInspirationFormSchema.shape.content}
          formPushError={form.pushError}
          formPopError={form.popError}
          disabled={isEditActionPending || isDeleteActionPending}
        />
        <div className="flex min-h-9 items-center justify-end pr-2">
          <DateInput
            value={form.date!}
            setValue={(value) => form.set({ date: value })}
            validation={editInspirationFormSchema.shape.date}
            formPushError={form.pushError}
            formPopError={form.popError}
            disabled={isEditActionPending || isDeleteActionPending}
          />
          <CheckboxInput
            value={form.highlight!}
            acceptIndeterminate={false}
            setValue={(value) => form.set({ highlight: value })}
            validation={editInspirationFormSchema.shape.highlight}
            formPushError={form.pushError}
            formPopError={form.popError}
            disabled={isEditActionPending || isDeleteActionPending}
            classNames={{ button: "pl-4" }}
            checkedIcon={<Star fill="currentColor" />}
            uncheckedIcon={<Star />}
          />
        </div>
      </div>
      <SearchSelect
        formPushError={form.pushError}
        formPopError={form.popError}
        defaultValue={queryData.relatedBigPaints}
        value={form.related_big_paints_ids!}
        setValue={(value) => form.set({ related_big_paints_ids: value })}
        validation={editInspirationFormSchema.shape.related_big_paints_ids}
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
      <SearchSelect
        formPushError={form.pushError}
        formPopError={form.popError}
        defaultValue={queryData.relatedInspirations}
        value={form.related_inspirations_ids!}
        setValue={(value) => form.set({ related_inspirations_ids: value })}
        validation={editInspirationFormSchema.shape.related_inspirations_ids}
        searchAction={(prevState, { query }) =>
          searchInspirationAction({
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
        title="Related Inspirations"
        selectId={(value) => value.id}
        selectContent={(value) => value.content}
        disabled={isEditActionPending || isDeleteActionPending}
        blacklist={[{ content: "", id }]}
      />
    </form>
  );
}
