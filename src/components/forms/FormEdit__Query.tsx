"use client";

import ActionDelete__Query from "@/actions/ActionDelete__Query";
import ActionEdit__Query from "@/actions/ActionEdit__Query";
import Button from "@/components/Button";
import FieldText from "@/components/form_ui/FieldText";
import { InformationCircle } from "@/components/icons";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/popover";
import useFormEdit__Query from "@/stores/forms/useFormEdit__Query";
import useQueryQueries__View from "@/stores/queries/useQueryQueries__View";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function FormEdit__Query({
  data,
}: {
  data: {
    values: string;
    name: string;
    date: Date;
  };
}) {
  const router = useRouter();

  const invalidateQueryQueries__View = useQueryQueries__View(
    (state) => state.invalidate,
  );

  const [isDeleteFormPending, setIsDeleteFormPending] = useState(false);
  const [isEditFormPending, setIsEditFormPending] = useState(false);

  const form = useFormEdit__Query();
  useEffect(() => {
    form.setOnSubmit(async (form) => {
      setIsEditFormPending(true);

      const values = form.values();

      await ActionEdit__Query({
        ...values,
        values: data.values,
      });
      invalidateQueryQueries__View();

      setIsEditFormPending(false);
    });
  }, [form.setOnSubmit, data]);

  useEffect(() => {
    // TODO: Based on this condition, if client-side re-routing here leads to server side refetch, then we should maybe use query.
    // Also take into account the scenario in which the entry, when you re-route, it's deleted. Furthermore more, I see some data transferring in the network tab
    // when client-side routing even and/or at least to the same (cached) entry.
    if (data.values !== form.meta.lastId) {
      form.setMetas({
        name: data.name,
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

              await ActionDelete__Query({
                values: data.values,
              });
              invalidateQueryQueries__View();

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
          acceptIndeterminate
        />
      </div>
    </div>
  );
}
