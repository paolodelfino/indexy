"use client";

import ActionCreate__BigPaint from "@/actions/ActionCreate__BigPaint";
import Button from "@/components/Button";
import FieldText from "@/components/form_ui/FieldText";
import { InformationCircle } from "@/components/icons";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/popover";
import useFormCreate__BigPaint from "@/stores/forms/useFormCreate__BigPaint";
import useQueryBigPaint__Pool from "@/stores/queries/useQueryBigPaint__Pool";
import useQueryBigPaint__Query from "@/stores/queries/useQueryBigPaint__Query";
import useQueryGraph__Fetch from "@/stores/queries/useQueryGraph__Fetch";
import useQueryInspiration__Pool from "@/stores/queries/useQueryInspiration__Pool";
import useQueryInspiration__Query from "@/stores/queries/useQueryInspiration__Query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const router = useRouter();

  const invalidate__QueryBigPaint__Pool = useQueryBigPaint__Pool(
    (state) => state.invalidate,
  );
  const invalidate__QueryBigPaint__Query = useQueryBigPaint__Query(
    (state) => state.invalidate,
  );
  const invalidate__QueryInspiration__Pool = useQueryInspiration__Pool(
    (state) => state.invalidate,
  );
  const invalidate__QueryGraph__Fetch = useQueryGraph__Fetch(
    (state) => state.invalidate,
  );
  const invalidate__QueryInspiration__Query = useQueryInspiration__Query(
    (state) => state.invalidate,
  );

  const [isCreateFormPending, setIsCreateFormPending] = useState(false);

  const form = useFormCreate__BigPaint();
  useEffect(() => {
    form.setOnSubmit(async (form) => {
      setIsCreateFormPending(true);

      const id = await ActionCreate__BigPaint(form.values());

      invalidate__QueryBigPaint__Pool();
      invalidate__QueryBigPaint__Query();
      invalidate__QueryInspiration__Pool();
      invalidate__QueryGraph__Fetch();
      invalidate__QueryInspiration__Query();

      form.reset();

      router.push(`/edit/big_paint/${id}`);

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
          {isCreateFormPending ? "Creating..." : "Create & Edit"}
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
