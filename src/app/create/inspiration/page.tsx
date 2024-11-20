"use client";

import ActionCreate__BigPaint from "@/actions/ActionCreate__Inspiration";
import Button from "@/components/Button";
import FieldTextArea from "@/components/form_ui/FieldTextArea";
import { InformationCircle } from "@/components/icons";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/popover";
import useFormCreate__Inspiration from "@/stores/forms/useFormCreate__Inspiration";
import useInspirationSearchQuery from "@/stores/queries/useQueryInspirations__Search";
import useInspirationViewQuery from "@/stores/queries/useQueryInspirations__View";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const router = useRouter();

  const invalidateInspirationViewQuery = useInspirationViewQuery(
    (state) => state.invalidate,
  );
  const invalidateInspirationSearchQuery = useInspirationSearchQuery(
    (state) => state.invalidate,
  );

  const [isCreateFormPending, setIsCreateFormPending] = useState(false);

  const form = useFormCreate__Inspiration();
  useEffect(() => {
    form.setOnSubmit(async (form) => {
      setIsCreateFormPending(true);

      await ActionCreate__BigPaint(form.values());

      invalidateInspirationViewQuery();
      invalidateInspirationSearchQuery();

      form.reset();

      setIsCreateFormPending(false);
    });
  }, [form.setOnSubmit]);

  return (
    <div className="space-y-6 pb-16">
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
        Create Inspiration
      </h1>
      <FieldTextArea
        meta={form.fields.content.meta}
        setMeta={form.setMeta.bind(form, "content")}
        setValue={form.setValue.bind(form, "content")}
        error={form.fields.content.error}
        disabled={isCreateFormPending}
      />
    </div>
  );
}
