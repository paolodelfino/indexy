"use client";

import Button from "@/components/Button";
import FieldNumber from "@/components/form_ui/FieldNumber";
import FieldSelect from "@/components/form_ui/FieldSelect";
import FieldText from "@/components/form_ui/FieldText";
import { InformationCircle } from "@/components/icons";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/popover";
import schemaGraph__Fetch from "@/schemas/schemaGraph__Fetch";
import useFormCreate__Strings from "@/stores/forms/useFormCreate__Strings";
import { formValuesToString } from "@/utils/url";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo } from "react";

// TODO: Maybe I should do this everywhere, maybe on params too (See what nextjs guide says), but at the moment I don't see other problems
function ComponentUseSearchParams() {
  const searchParams = useSearchParams();
  const form = useFormCreate__Strings();

  const init = useMemo(
    () =>
      schemaGraph__Fetch.parse({
        type: searchParams.get("type"),
        id: searchParams.get("id"),
        show: undefined,
        depth: 5,
      }),
    [searchParams],
  );

  useEffect(() => {
    if (
      // TODO: Maybe save and compare this couple to form.meta in order to preserve form changes across re-routing
      init.type !== form.fields.type.value ||
      init.id !== form.fields.id.value
    ) {
      form.setMetas({
        type: { selectedItem: init.type },
        id: init.id,
        depth: {
          value: Math.abs(init.depth),
          isNegative: init.depth < 0 ? true : false,
        },
      });
    }
  }, [init]);

  return undefined;
}

export default function Page() {
  const form = useFormCreate__Strings();
  const router = useRouter();

  useEffect(() => {
    form.setOnSubmit(async (form) => {
      // const a = formValuesToString(form.values());
      // console.log(a, formValuesFromString(a));
      router.push(`/strings/${formValuesToString(form.values())}`);
    });
  }, [form.setOnSubmit]);

  return (
    <div className="space-y-6 pb-32">
      <Suspense>
        <ComponentUseSearchParams />
      </Suspense>

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

        <Button color="accent" disabled={form.isInvalid} onClick={form.submit}>
          Query
        </Button>
      </div>

      <FieldText
        label="Id"
        disabled={false}
        error={form.fields.id.error}
        meta={form.fields.id.meta}
        setMeta={form.setMeta.bind(null, "id")}
        setValue={form.setValue.bind(null, "id")}
      />

      <div>
        <h2 className="py-1 pl-4 text-lg font-medium leading-10 data-[disabled=true]:opacity-50">
          Type
        </h2>
        <FieldSelect
          placeholder="Type"
          disabled={false}
          error={form.fields.type.error}
          meta={form.fields.type.meta}
          setMeta={form.setMeta.bind(null, "type")}
          setValue={form.setValue.bind(null, "type")}
        />
      </div>

      <div>
        <h2 className="py-1 pl-4 text-lg font-medium leading-10 data-[disabled=true]:opacity-50">
          Depth
        </h2>
        <FieldNumber
          placeholder="Depth"
          error={form.fields.depth.error}
          meta={form.fields.depth.meta}
          setMeta={form.setMeta.bind(null, "depth")}
          setValue={form.setValue.bind(null, "depth")}
        />
      </div>

      <div>
        <h2 className="py-1 pl-4 text-lg font-medium leading-10 data-[disabled=true]:opacity-50">
          Show
        </h2>
        <FieldSelect
          placeholder="Show"
          disabled={false}
          error={form.fields.show.error}
          meta={form.fields.show.meta}
          setMeta={form.setMeta.bind(null, "show")}
          setValue={form.setValue.bind(null, "show")}
          acceptIndeterminate
        />
      </div>
    </div>
  );
}
