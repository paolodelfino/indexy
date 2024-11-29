"use client";

import Button from "@/components/Button";
import UIBigPaint from "@/components/db_ui/UIBigPaint";
import UIInspiration from "@/components/db_ui/UIInspiration";
import useInfiniteQuery from "@/hooks/useInfiniteQuery";
import schemaPool__Query from "@/schemas/schemaPool__Query";
import useFormQuery__Pool from "@/stores/forms/useFormQuery__Pool";
import useQueryBigPaint__Pool from "@/stores/queries/useQueryBigPaint__Pool";
import useQueryInspiration__Pool from "@/stores/queries/useQueryInspiration__Pool";
import { cn } from "@/utils/cn";
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
    <div className="flex h-full max-h-screen flex-col">
      <div className={cn("flex flex-col", form.meta.showBigPaint && "h-full")}>
        <Button
          disabled={query__BigPaint.isFetching}
          full
          size="large"
          classNames={{ button: "py-5" }}
          onClick={() =>
            form.setFormMeta({
              showBigPaint: !form.meta.showBigPaint,
              showInspiration: false,
            })
          }
        >
          BigPaints{" "}
          {query__BigPaint.data !== undefined && `(${query__BigPaint.total})`}
        </Button>
        {form.meta.showBigPaint && query__BigPaint.data === undefined && (
          <p>loading no cache</p>
        )}
        {form.meta.showBigPaint &&
          query__BigPaint.data !== undefined &&
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

      <div
        className={cn("flex flex-col", form.meta.showInspiration && "h-full")}
      >
        <Button
          disabled={query__Inspiration.isFetching}
          full
          size="large"
          classNames={{ button: "py-5" }}
          onClick={() =>
            form.setFormMeta({
              showInspiration: !form.meta.showInspiration,
              showBigPaint: false,
            })
          }
        >
          Inspirations{" "}
          {query__Inspiration.data !== undefined &&
            `(${query__Inspiration.total})`}
        </Button>
        {form.meta.showInspiration && query__Inspiration.data === undefined && (
          <p>loading no cache</p>
        )}
        {form.meta.showInspiration &&
          query__Inspiration.data !== undefined &&
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
