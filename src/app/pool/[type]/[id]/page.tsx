"use client";

import UIBigPaint from "@/components/db_ui/UIBigPaint";
import UIInspiration from "@/components/db_ui/UIInspiration";
import useInfiniteQuery from "@/hooks/useInfiniteQuery";
import schemaPool__Query from "@/schemas/schemaPool__Query";
import useFormQuery__Pool from "@/stores/forms/useFormQuery__Pool";
import useQueryBigPaint__Pool from "@/stores/queries/useQueryBigPaint__Pool";
import useQueryInspiration__Pool from "@/stores/queries/useQueryInspiration__Pool";
import { useEffect, useMemo } from "react";
import { VList } from "virtua";

export default function Page({
  params,
}: {
  params: { type: string; id: string };
}) {
  const values = useMemo(() => schemaPool__Query.parse(params), [params]);

  const form = useFormQuery__Pool();
  const query__BigPaint = useQueryBigPaint__Pool();
  const query__Inspiration = useQueryInspiration__Pool();

  useEffect(() => {
    query__BigPaint.active();
    query__Inspiration.active();
    return () => {
      query__BigPaint.inactive();
      query__Inspiration.inactive();
    };
  }, []);

  useEffect(() => {
    // TODO: Is this check needed?
    if (
      form.meta.lastValues === undefined ||
      values.id !== form.meta.lastValues.id ||
      values.type !== form.meta.lastValues.type
    ) {
      form.setFormMeta({
        lastValues: values,
      });
      query__BigPaint.reset();
      query__Inspiration.reset();
      query__BigPaint.active().then(() => query__BigPaint.fetch(values));
      query__Inspiration.active().then(() => query__Inspiration.fetch(values));
    }
  }, [values]);

  // TODO: Magari non fetchiamo fin quando non è visible
  const id__BigPaint = useInfiniteQuery({
    nextOffset: query__BigPaint.nextOffset,
    data: query__BigPaint.data,
    getId(item) {
      return item.id;
    },
    callback: () => query__BigPaint.fetch(values),
    fetchIfNoData: false,
    active: query__BigPaint.active,
    inactive: query__BigPaint.inactive,
  });
  const id__Inspiration = useInfiniteQuery({
    nextOffset: query__Inspiration.nextOffset,
    data: query__Inspiration.data,
    getId(item) {
      return item.id;
    },
    callback: () => query__Inspiration.fetch(values),
    fetchIfNoData: false,
    active: query__Inspiration.active,
    inactive: query__Inspiration.inactive,
  });

  return (
    <div className="flex h-full max-h-screen flex-col space-y-6">
      <div className="flex h-[40vh] shrink-0 flex-col">
        <h2
          data-disabled={query__BigPaint.isFetching}
          className="bg-neutral-800 py-4 pl-4 text-lg font-medium leading-10 data-[disabled=true]:opacity-50"
        >
          BigPaints
        </h2>
        {query__BigPaint.data === undefined && <p>loading no cache</p>}
        {query__BigPaint.data !== undefined &&
          query__BigPaint.data.length <= 0 && <p>empty</p>}
        {query__BigPaint.data !== undefined &&
          query__BigPaint.data.length > 0 && (
            <VList
              keepMounted={
                query__BigPaint.isFetching
                  ? []
                  : [
                      query__BigPaint.data.length - 1,
                      query__BigPaint.data.length - 1 + 1,
                    ]
              }
              className="pb-16 scrollbar-hidden"
            >
              {query__BigPaint.data.map((it, i) => {
                return (
                  <UIBigPaint
                    key={it.id}
                    data={it}
                    id={`${id__BigPaint}_${it.id}`}
                  />
                );
              })}
              {query__BigPaint.isFetching ? "loading..." : ""}
            </VList>
          )}
      </div>

      <div className="flex h-[50vh] shrink-0 flex-col">
        <h2
          data-disabled={query__Inspiration.isFetching}
          className="bg-neutral-800 py-4 pl-4 text-lg font-medium leading-10 data-[disabled=true]:opacity-50"
        >
          Inspirations
        </h2>
        {query__Inspiration.data === undefined && <p>loading no cache</p>}
        {query__Inspiration.data !== undefined &&
          query__Inspiration.data.length <= 0 && <p>empty</p>}
        {query__Inspiration.data !== undefined &&
          query__Inspiration.data.length > 0 && (
            <VList
              keepMounted={
                query__Inspiration.isFetching
                  ? []
                  : [
                      query__Inspiration.data.length - 1,
                      query__Inspiration.data.length - 1 + 1,
                    ]
              }
              className="pb-16 scrollbar-hidden"
            >
              {query__Inspiration.data.map((it, i) => {
                return (
                  <UIInspiration
                    key={it.id}
                    data={it}
                    id={`${id__Inspiration}_${it.id}`}
                  />
                );
              })}
              {query__Inspiration.isFetching ? "loading..." : ""}
            </VList>
          )}
      </div>
    </div>
  );
}
