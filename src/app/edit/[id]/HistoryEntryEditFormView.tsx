"use client";

import deleteBigPaintHistoryEntryAction from "@/actions/deleteBigPaintHistoryEntryAction";
import deleteInspirationHistoryEntryAction from "@/actions/deleteInspirationHistoryEntryAction";
import updateBigPaintHistoryAction from "@/actions/updateBigPaintHistoryAction";
import updateInspirationHistoryAction from "@/actions/updateInspirationHistoryAction";
import Button from "@/components/Button";
import FormText from "@/components/form/FormText";
import { InformationCircle } from "@/components/icons";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/popover";
import useBigPaintHistoryQuery from "@/stores/useBigPaintHistoryQuery";
import useEditHistoryEntryForm from "@/stores/useEditHistoryEntryForm";
import useInspirationHistoryQuery from "@/stores/useInspirationHistoryQuery";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function HistoryEntryEditFormView({
  data,
  type,
}: {
  type: "inspiration_history" | "big_paint_history";
  data: {
    values: string;
    name: string | null;
  };
}) {
  const router = useRouter();

  const invalidateBigPaintHistoryQuery = useBigPaintHistoryQuery(
    (state) => state.invalidate,
  );
  const invalidateInspirationHistoryQuery = useInspirationHistoryQuery(
    (state) => state.invalidate,
  );

  const [isDeleteFormPending, setIsDeleteFormPending] = useState(false);
  const [isEditFormPending, setIsEditFormPending] = useState(false);

  const form = useEditHistoryEntryForm();
  useEffect(() => {
    form.setOnSubmit(async (form) => {
      setIsEditFormPending(true);

      const values = form.values();

      if (type === "big_paint_history") {
        await updateBigPaintHistoryAction({
          values: data.values,
          ...values,
        });
        invalidateBigPaintHistoryQuery();
      } else {
        await updateInspirationHistoryAction({
          values: data.values,
          ...values,
        });
        invalidateInspirationHistoryQuery();
      }

      setIsEditFormPending(false);
    });
  }, [form.setOnSubmit, data]);

  useEffect(() => {
    // TODO: Based on this condition, if client-side re-routing here leads to server side refetch, then we should maybe use query.
    // Also take into account the scenario in which the entry, when you re-route, it's deleted. Furthermore more, I see some data transferring in the network tab
    // when client-side routing even and/or at least to the same (cached) entry.
    if (data.values !== form.meta.lastId) {
      form.setMetas({
        name: data.name === null ? "" : data.name,
      });

      form.setFormMeta({ lastId: data.values });
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

              if (type === "big_paint_history") {
                await deleteBigPaintHistoryEntryAction({
                  values: data.values,
                });
                invalidateBigPaintHistoryQuery();
              } else {
                await deleteInspirationHistoryEntryAction({
                  values: data.values,
                });
                invalidateInspirationHistoryQuery();
              }

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
          setValue={
            (value) =>
              form.setValue("name", (value === undefined ? null : value) as any) // TODO: Probably have to do something about this
          }
          setMeta={form.setMeta.bind(form, "name")}
          meta={form.fields.name.meta}
          error={form.fields.name.error}
          disabled={isEditFormPending || isDeleteFormPending}
        />
      </div>
    </div>
  );
}
