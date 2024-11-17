"use client";

import Inspiration from "@/components/inspiration/Inspiration";
import useInfiniteQuery from "@/hooks/useInfiniteQuery";
import useInspirationQuery from "@/stores/useInspirationViewQuery";

export default function () {
  const query = useInspirationQuery();

  const id = useInfiniteQuery({
    active: query.active,
    inactive: query.inactive,
    callback: query.fetch,
    fetchIfNoData: true,
    hasData: query.data !== undefined,
    lastId: query.data?.[query.data.length - 1].id,
    nextOffset: query.nextOffset,
  });

  if (query.data === undefined) return <span>loading no cache</span>;

  if (query.data.length <= 0) return <span>empty</span>;

  return (
    <>
      <ul>
        {query.data.map((it) => {
          return <Inspiration key={it.id} data={it} id={`${id}_${it.id}`} />;
        })}
      </ul>
      {query.isFetching && <span>loading next</span>}
    </>
  );
}
