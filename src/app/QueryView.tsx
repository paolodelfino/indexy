"use client";

import Query from "@/app/Query";
import useInfiniteQuery from "@/hooks/useInfiniteQuery";
import useQueryQueries__View from "@/stores/queries/useQueryQueries__View";
import { VList } from "virtua";

export default function QueryView() {
  const query = useQueryQueries__View();

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
        return <Query key={it.values} data={it} id={`${id}_${it.values}`} />;
      })}
      {query.isFetching ? <p>loading next</p> : ""}
    </VList>
  );
}
