"use client";

import Button from "@/components/Button";
import UIBigPaint from "@/components/db_ui/UIBigPaint";
import UIInspiration from "@/components/db_ui/UIInspiration";
import useInfiniteQuery from "@/hooks/useInfiniteQuery";
import schemaPool__Query from "@/schemas/schemaPool__Query";
import useQueryBigPaint__Pool from "@/stores/queries/useQueryBigPaint__Pool";
import useQueryInspiration__Pool from "@/stores/queries/useQueryInspiration__Pool";
import { useEffect, useMemo, useState } from "react";
import { VList } from "virtua";

export default function Page({
  params,
}: {
  params: { type: string; id: string };
}) {
  const values = useMemo(() => schemaPool__Query.parse(params), [params]);

  const query__BigPaint = useQueryBigPaint__Pool();
  const query__Inspiration = useQueryInspiration__Pool();

  useEffect(() => {
    query__BigPaint.active();
    query__Inspiration.active();
    return () => {
      query__BigPaint.inactive();
      query__Inspiration.inactive();
    };
  });

  // TODO: Make persistent
  const [isBigPaintOpen, setIsBigPaintOpen] = useState(false);
  const [isInspirationOpen, setIsInspirationOpen] = useState(false);

  const id__BigPaint = useInfiniteQuery({
    nextOffset: query__BigPaint.nextOffset,
    data: query__BigPaint.data,
    getId(item) {
      return item.id;
    },
    callback: () => query__BigPaint.fetch(values),
    fetchIfNoData: true,
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
    fetchIfNoData: true,
    active: query__Inspiration.active,
    inactive: query__Inspiration.inactive,
  });

  return (
    <div>
      <Button
        full
        size="large"
        classNames={{ button: "py-5" }}
        onClick={() => setIsBigPaintOpen((state) => !state)}
      >
        BigPaints
      </Button>
      <Button
        full
        size="large"
        classNames={{ button: "py-5" }}
        onClick={() => setIsInspirationOpen((state) => !state)}
      >
        Inspirations
      </Button>

      {isBigPaintOpen && query__BigPaint.data === undefined && (
        <span>loading no cache</span>
      )}
      {isBigPaintOpen &&
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

      {isInspirationOpen && query__Inspiration.data === undefined && (
        <span>loading no cache</span>
      )}
      {isInspirationOpen &&
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
  );
}
