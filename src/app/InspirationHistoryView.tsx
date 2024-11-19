"use client";

import HistoryEntry from "@/app/HistoryEntry";
import useInfiniteQuery from "@/hooks/useInfiniteQuery";
import useInspirationHistoryQuery from "@/stores/useInspirationHistoryQuery";
import { VList } from "virtua";

export default function InspirationHistoryView() {
  const query = useInspirationHistoryQuery();

  const id = useInfiniteQuery({
    callback: query.fetch,
    fetchIfNoData: true,
    nextOffset: query.nextOffset,
    active: query.active,
    inactive: query.inactive,
    data: query.data,
    getId(item) {
      return item.values;
    },
  });

  if (query.data === undefined) return <p>loading no cache</p>;

  if (query.data.length <= 0) return <p>empty</p>;

  return (
    <VList
      // ssrCount={}
      keepMounted={[query.data.length - 1, query.data.length - 1 + 1]}
      className="pb-16 scrollbar-hidden"
    >
      {query.data.map((it) => {
        return (
          <HistoryEntry
            key={it.values}
            data={it}
            id={`${id}_${it.values}`}
            type="inspiration"
          />
        );
      })}
      {query.isFetching ? <p>loading next</p> : ""}
    </VList>
  );
}
