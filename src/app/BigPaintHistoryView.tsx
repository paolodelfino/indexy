"use client";

import HistoryEntry from "@/app/HistoryEntry";
import useInfiniteQuery from "@/hooks/useInfiniteQuery";
import useBigPaintHistoryQuery from "@/stores/queries/useBigPaintHistoryQuery";
import { VList } from "virtua";

export default function BigPaintHistoryView() {
  const query = useBigPaintHistoryQuery();

  const id = useInfiniteQuery({
    callback: query.fetch,
    fetchIfNoData: true,
    data: query.data,
    getId(item) {
      return item.values;
    },
    nextOffset: query.nextOffset,
    active: query.active,
    inactive: query.inactive,
  });

  if (query.data === undefined) return <span>loading no cache</span>;

  if (query.data.length <= 0) return <span>empty</span>;

  return (
    <VList
      keepMounted={[query.data.length - 1, query.data.length - 1 + 1]}
      className="pb-16 scrollbar-hidden"
    >
      {query.data.map((it) => {
        return (
          <HistoryEntry
            key={it.values}
            data={it}
            id={`${id}_${it.values}`}
            type="big_paint"
          />
        );
      })}
      {query.isFetching ? <span>loading next</span> : ""}
    </VList>
  );
}
