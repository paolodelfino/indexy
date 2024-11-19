"use client";

import Inspiration from "@/components/inspiration/Inspiration";
import useInfiniteQuery from "@/hooks/useInfiniteQuery";
import useInspirationQuery from "@/stores/useInspirationViewQuery";
import { VList } from "virtua";

// TODO: Possible server side first items injection
export default function InspirationView() {
  const query = useInspirationQuery();

  const id = useInfiniteQuery({
    active: query.active,
    inactive: query.inactive,
    callback: query.fetch,
    fetchIfNoData: true,
    hasData: query.data !== undefined,
    lastId:
      query.data === undefined || query.data.length <= 0
        ? undefined
        : query.data[query.data.length - 1].id,
    nextOffset: query.nextOffset,
  });

  if (query.data === undefined) return <span>loading no cache</span>;

  if (query.data.length <= 0) return <span>empty</span>;

  return (
    <VList
      // overscan={20} 20 = limit
      keepMounted={[query.data.length - 1, query.data.length - 1 + 1]}
      className="pb-16 scrollbar-hidden"
    >
      {query.data.map((it) => {
        return <Inspiration key={it.id} data={it} id={`${id}_${it.id}`} />;
      })}
      {query.isFetching ? <span>loading next</span> : ""}
    </VList>
  );
}
