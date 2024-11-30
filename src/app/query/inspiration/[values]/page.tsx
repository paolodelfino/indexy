"use client";

import ActionEdit__Query from "@/actions/ActionEdit__Query";
import UIInspiration from "@/components/db_ui/UIInspiration";
import useInfiniteQuery from "@/hooks/useInfiniteQuery";
import schemaInspiration__Query from "@/schemas/schemaInspiration__Query";
import useFormQuery__Inspiration from "@/stores/forms/useFormQuery__Inspiration";
import useQueryInspiration__Query from "@/stores/queries/useQueryInspiration__Query";
import useQueryQuery__Query from "@/stores/queries/useQueryQuery__Query";
import useQueryQuery__View from "@/stores/queries/useQueryQuery__View";
import { formValuesFromString } from "@/utils/url";
import { useEffect, useMemo } from "react";
import { VList } from "virtua";

export default function Page({
  params: { values: valuesStr },
}: {
  params: { values: string };
}) {
  const values = useMemo(
    () =>
      // TODO: Possiamo probabilmente evitare di parsare con zod qui
      schemaInspiration__Query.parse(formValuesFromString(valuesStr)),
    [valuesStr],
  );

  const query = useQueryInspiration__Query();
  const form = useFormQuery__Inspiration();

  const invalidate__QueryQuery__View = useQueryQuery__View(
    (state) => state.invalidate,
  );
  const invalidate__QueryQuery__Query = useQueryQuery__Query(
    (state) => state.invalidate,
  );

  useEffect(() => {
    if (valuesStr !== form.meta.lastValues) {
      query.reset();
      query.active();

      ActionEdit__Query(valuesStr, { date: new Date() }).then(() => {
        invalidate__QueryQuery__View();
        invalidate__QueryQuery__Query();
        // TODO: Furthemore I have to attach to an onRevalidate event, when useQueryInspirations__Search gets invalidated it does another fetch, furthermore maybe I should also attach to useInfiniteQuery's callback. I should move this whole to callback and onrevalidate
      });

      form.setFormMeta({ lastValues: valuesStr });
    }
  }, [values]);

  const id = useInfiniteQuery({
    nextOffset: query.nextOffset,
    data: query.data,
    getId(item) {
      return item.id;
    },
    callback: () => query.fetch(values),
    fetchIfNoData: true,
    active: query.active,
    inactive: query.inactive,
  });

  if (query.data === undefined) return <span>loading no cache</span>;

  return (
    <div className="flex h-full flex-col">
      <h2 className="p-4 text-lg font-medium">Result ({query.total})</h2>
      {query.data.length > 0 && (
        <VList
          keepMounted={
            query.isFetching
              ? []
              : [query.data.length - 1, query.data.length - 1 + 1]
          }
          className="pb-32 scrollbar-hidden"
        >
          {query.data.map((it, i) => {
            return (
              <UIInspiration key={it.id} data={it} id={`${id}_${it.id}`} />
            );
          })}
          {query.isFetching ? "loading..." : ""}
        </VList>
      )}
    </div>
  );
}
