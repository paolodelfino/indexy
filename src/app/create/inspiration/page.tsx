"use client";

import ActionCreate__Inspiration from "@/actions/ActionCreate__Inspiration";
import AEditor from "@/components/AEditor";
import Button from "@/components/Button";
import { InformationCircle } from "@/components/icons";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/popover";
import useFormCreate__Inspiration from "@/stores/forms/useFormCreate__Inspiration";
import useQueryInspiration__Query from "@/stores/queries/useQueryInspiration__Query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const router = useRouter();

  const invalidateQueryInspiration__Query = useQueryInspiration__Query(
    (state) => state.invalidate,
  );
  // const invalidateQueryBigPaint__Query = useQueryBigPaint__Query(
  //   (state) => state.invalidate,
  // );

  const [isCreateFormPending, setIsCreateFormPending] = useState(false);

  const form = useFormCreate__Inspiration();
  useEffect(() => {
    form.setOnSubmit(async (form) => {
      setIsCreateFormPending(true);

      // TODO: Qui assumiamo che il valore corrente di value è sempre associato al valore corrente di meta
      const unused = form.fields.resources.meta.items.filter((it) => it.unused);
      if (unused.length > 0) alert(`${unused.length} unused assets`);
      else {
        // console.log("form values", form.values());
        // console.log("value direct", form.fields.resources.value);
        await ActionCreate__Inspiration(form.values());

        invalidateQueryInspiration__Query();
        // invalidateQueryBigPaint__Query();

        form.reset();
      }

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
      <AEditor
        meta={form.fields.resources.meta}
        setMeta={form.setMeta.bind(null, "resources")}
        setValue={form.setValue.bind(null, "resources")}
        error={form.fields.resources.error}
        meta__FieldTextArea={form.fields.content.meta}
        setMeta__FieldTextArea={form.setMeta.bind(null, "content")}
        setValue__FieldTextArea={form.setValue.bind(null, "content")}
        error__FieldTextArea={form.fields.content.error}
        disabled={isCreateFormPending}
      />
    </div>
  );
}
