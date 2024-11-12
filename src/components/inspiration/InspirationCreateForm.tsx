"use client";
import { createInspirationAction } from "@/actions/createInspirationAction";
import Button from "@/components/Button";
import FormText from "@/components/form/FormText";
import { useCreateInspirationForm } from "@/stores/useCreateInspirationForm";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function InspirationCreateForm() {
  const router = useRouter();

  const queryClient = useQueryClient();

  const [isCreateFormPending, setIsCreateFormPending] = useState(false);

  const form = useCreateInspirationForm();
  useEffect(() => {
    form.setOnSubmit(async (form) => {
      setIsCreateFormPending(true);

      await createInspirationAction(form.values());

      queryClient.invalidateQueries({ queryKey: ["big_paints"] });

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
      <h1
        data-disabled={isCreateFormPending}
        className="py-1 pl-4 text-2xl font-medium leading-[3rem] data-[disabled=true]:opacity-50"
      >
        Create Inspiration
      </h1>
      <FormText
        meta={form.fields.content.meta}
        setMeta={form.setMeta.bind(form, "content")}
        setValue={form.setValue.bind(form, "content")}
        error={form.fields.content.error}
        disabled={isCreateFormPending}
      />
    </div>
  );
}
