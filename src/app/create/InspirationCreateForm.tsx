"use client";

import { createInspirationAction } from "@/actions/createInspirationAction";
import Button from "@/components/Button";
import FormTextArea from "@/components/form/FormTextArea";
import { InformationCircle } from "@/components/icons";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/popover";
import { useCreateInspirationForm } from "@/stores/useCreateInspirationForm";
import useInspirationSearchQuery from "@/stores/useInspirationSearchQuery";
import useInspirationViewQuery from "@/stores/useInspirationViewQuery";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function InspirationCreateForm() {
  const router = useRouter();

  const invalidateInspirationViewQuery = useInspirationViewQuery(
    (state) => state.invalidate,
  );
  const invalidateInspirationSearchQuery = useInspirationSearchQuery(
    (state) => state.invalidate,
  );

  const [isCreateFormPending, setIsCreateFormPending] = useState(false);

  const form = useCreateInspirationForm();
  useEffect(() => {
    form.setOnSubmit(async (form) => {
      setIsCreateFormPending(true);

      await createInspirationAction(form.values());

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
      <FormTextArea
        meta={form.fields.content.meta}
        setMeta={form.setMeta.bind(form, "content")}
        setValue={form.setValue.bind(form, "content")}
        error={form.fields.content.error}
        disabled={isCreateFormPending}
      />
    </div>
  );
}
