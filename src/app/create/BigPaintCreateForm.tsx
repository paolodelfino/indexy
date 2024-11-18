"use client";

import { createBigPaintAction } from "@/actions/createBigPaintAction";
import Button from "@/components/Button";
import FormText from "@/components/form/FormText";
import { InformationCircle } from "@/components/icons";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/popover";
import useBigPaintSearchQuery from "@/stores/useBigPaintSearchQuery";
import useBigPaintViewQuery from "@/stores/useBigPaintViewQuery";
import { useCreateBigPaintForm } from "@/stores/useCreateBigPaintForm";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function BigPaintCreateForm() {
  const router = useRouter();

  const invalidateBigPaintViewQuery = useBigPaintViewQuery(
    (state) => state.invalidate,
  );
  const invalidateBigPaintSearchQuery = useBigPaintSearchQuery(
    (state) => state.invalidate,
  );

  const [isCreateFormPending, setIsCreateFormPending] = useState(false);

  const form = useCreateBigPaintForm();
  useEffect(() => {
    form.setOnSubmit(async (form) => {
      setIsCreateFormPending(true);

      await createBigPaintAction(form.values());

      invalidateBigPaintViewQuery();
      invalidateBigPaintSearchQuery();

      form.reset();

      setIsCreateFormPending(false);
    });
  }, [form.setOnSubmit]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-4">
        <Button
          disabled={isCreateFormPending}
          onClick={() => {
            router.back();
          }}
        >
          Close
        </Button>
        <Button
          color="accent"
          disabled={isCreateFormPending || form.isInvalid}
          onClick={form.submit}
        >
          {isCreateFormPending ? "Saving..." : "Save"}
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
      <h1
        data-disabled={isCreateFormPending}
        className="py-1 pl-4 text-2xl font-medium leading-[3rem] data-[disabled=true]:opacity-50"
      >
        Create BigPaint
      </h1>
      <FormText
        meta={form.fields.name.meta}
        setMeta={form.setMeta.bind(form, "name")}
        setValue={form.setValue.bind(form, "name")}
        error={form.fields.name.error}
        disabled={isCreateFormPending}
      />
    </div>
  );
}
