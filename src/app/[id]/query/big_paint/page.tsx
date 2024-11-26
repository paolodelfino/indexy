"use client";

import ActionEdit__Query from "@/actions/ActionEdit__Query";
import UIBigPaint from "@/components/db_ui/UIBigPaint";
import useInfiniteQuery from "@/hooks/useInfiniteQuery";
import schemaBigPaint__Search from "@/schemas/schemaBigPaint__Search";
import useFormSearch__BigPaint from "@/stores/forms/useFormSearch__BigPaint";
import useQueryBigPaints__Search from "@/stores/queries/useQueryBigPaints__Search";
import useQueryQueries__Search from "@/stores/queries/useQueryQueries__Search";
import useQueryQueries__View from "@/stores/queries/useQueryQueries__View";
import { formValuesFromString } from "@/utils/url";
import { useEffect, useMemo } from "react";
import { VList } from "virtua";

// TODO: Possible server side first items injection

export default function Page({
  params: { id: valuesStr },
}: {
  params: { id: string };
}) {
  const values = useMemo(
    () =>
      // TODO: Possiamo probabilmente evitare di parsare con zod qui
      schemaBigPaint__Search.parse(formValuesFromString(valuesStr)),
    [valuesStr],
  );

  const query = useQueryBigPaints__Search();
  const form = useFormSearch__BigPaint();

  const invalidateQueryQueries__View = useQueryQueries__View(
    (state) => state.invalidate,
  );
  const invalidateQueryQueries__Search = useQueryQueries__Search(
    (state) => state.invalidate,
  );

  useEffect(() => {
    if (valuesStr !== form.meta.lastValues) {
      query.reset();
      query.active();

      ActionEdit__Query(valuesStr, { date: new Date() }).then(() => {
        invalidateQueryQueries__View();
        invalidateQueryQueries__Search();
        // TODO: Furthemore I have to attach to an onRevalidate event, when useQueryBigPaints__Search gets invalidated it does another fetch, furthermore maybe I should also attach to useInfiniteQuery's callback. I should move this whole to callback and onrevalidate
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
    // callback: () => query.fetch(query.lastArgs![0]),
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
          className="pb-16 scrollbar-hidden"
        >
          {query.data.map((it, i) => {
            return <UIBigPaint key={it.id} data={it} id={`${id}_${it.id}`} />;
          })}
          {query.isFetching ? "loading..." : ""}
        </VList>
      )}
    </div>
  );
}
