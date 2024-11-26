"use client";

import ActionEdit__Query from "@/actions/ActionEdit__Query";
import UIInspiration from "@/components/db_ui/UIInspiration";
import useInfiniteQuery from "@/hooks/useInfiniteQuery";
import schemaInspiration__Search from "@/schemas/schemaInspiration__Search";
import useFormSearch__Inspiration from "@/stores/forms/useFormSearch__Inspiration";
import useQueryInspirations__Search from "@/stores/queries/useQueryInspirations__Search";
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
      schemaInspiration__Search.parse(formValuesFromString(valuesStr)),
    [valuesStr],
  );

  const query = useQueryInspirations__Search();
  const form = useFormSearch__Inspiration();

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
    // callback: () => query.fetch(query.lastArgs![0]),
    callback: () => query.fetch(values),
    fetchIfNoData: true,
    active: query.active,
    inactive: query.inactive,
  });

  if (query.data === undefined) return <span>loading no cache</span>;

  // TODO: Problema del doppio fetch (revalidation e next page) a causa della vlist che col client-side routing qui mostra solo gli ultimo due elementi mentre aggiorniamo e la guardia attiva il fetch alla prossima pagina
  return (
    <div className="flex h-full flex-col">
      <h2 className="p-4 text-lg font-medium">Result ({query.total})</h2>
      {query.data.length > 0 && (
        <VList
          keepMounted={[query.data.length - 1, query.data.length - 1 + 1]}
          className="pb-16 scrollbar-hidden"
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
