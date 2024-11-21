"use client";

import ActionCreate__BigPaint from "@/actions/ActionCreate__BigPaint";
import Button from "@/components/Button";
import FieldText from "@/components/form_ui/FieldText";
import { InformationCircle } from "@/components/icons";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/popover";
import useFormCreate__BigPaint from "@/stores/forms/useFormCreate__BigPaint";
import useQueryBigPaints__Search from "@/stores/queries/useQueryBigPaints__Search";
import useQueryBigPaints__View from "@/stores/queries/useQueryBigPaints__View";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const router = useRouter();

  const invalidateQueryBigPaints__View = useQueryBigPaints__View(
    (state) => state.invalidate,
  );
  const invalidateQueryBigPaints__Search = useQueryBigPaints__Search(
    (state) => state.invalidate,
  );

  const [isCreateFormPending, setIsCreateFormPending] = useState(false);

  const form = useFormCreate__BigPaint();
  useEffect(() => {
    form.setOnSubmit(async (form) => {
      setIsCreateFormPending(true);

      await ActionCreate__BigPaint(form.values());
      invalidateQueryBigPaints__View();
      invalidateQueryBigPaints__Search();

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
        Create BigPaint
      </h1>
      <FieldText
        meta={form.fields.name.meta}
        setMeta={form.setMeta.bind(form, "name")}
        setValue={form.setValue.bind(form, "name")}
        error={form.fields.name.error}
        disabled={isCreateFormPending}
      />
    </div>
  );
}
