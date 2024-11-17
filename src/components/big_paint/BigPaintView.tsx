"use client";

import BigPaint from "@/components/big_paint/BigPaint";
import useInfiniteQuery from "@/hooks/useInfiniteQuery";
import useBigPaintViewQuery from "@/stores/useBigPaintViewQuery";

export default function () {
  const query = useBigPaintViewQuery();

  const id = useInfiniteQuery({
    callback: query.fetch,
    fetchIfNoData: true,
    hasData: query.data !== undefined,
    lastId: query.data?.[query.data.length - 1].id,
    nextOffset: query.nextOffset,
    active: query.active,
    inactive: query.inactive,
  });

  if (query.data === undefined) return <span>loading no cache</span>;

  if (query.data.length <= 0) return <span>empty</span>;

  return (
    <>
      <ul>
        {query.data.map((it) => {
          return <BigPaint key={it.id} data={it} id={`${id}_${it.id}`} />;
        })}
      </ul>
      {query.isFetching && <span>loading next</span>}
    </>
  );
}
