"use client";
import { fetchBigPaintsAction } from "@/actions/fetchBigPaintsAction";
import BigPaint from "@/components/big_paint/BigPaint";
import { useApp } from "@/stores/useApp";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Fragment, useEffect } from "react";
import { useInView } from "react-intersection-observer";

export default function BigPaintView() {
  const [ref, inView] = useInView();

  const {
    status,
    data,
    error,
    isFetchingNextPage: isFetchingNext,
    fetchNextPage: fetchNext,
    hasNextPage: hasNext,
  } = useInfiniteQuery({
    queryKey: ["big_paints"],
    queryFn: ({ pageParam: offset }) => fetchBigPaintsAction(offset, 20),
    initialPageParam: 0,
    getPreviousPageParam: (firstData) => firstData?.previousOffset,
    getNextPageParam: (lastData) => lastData?.nextOffset,
    refetchInterval: 1000,
  });

  useEffect(() => {
    if (inView) fetchNext();
  }, [inView]);

  const makeEditAvailable = useApp((state) => state.makeEditAvailable);

  useEffect(() => {
    if (status === "success" && data && data.pages.length > 0)
      makeEditAvailable(true);
    else makeEditAvailable(false);

    return () => {
      makeEditAvailable(false);
    };
  }, [data]);

  if (status === "error") throw error;

  if (status === "pending") return <span>loading no cache</span>;

  if (data.pages.length <= 0) return <span>empty</span>;

  return (
    <>
      <ul>
        {data.pages.map((page, pageIndex) => (
          <Fragment
            key={`${pageIndex}-${page.previousOffset}-${page.nextOffset}-${page.data.length}`}
          >
            {page.data.map((it, itemIndex) => {
              const isLastEntry =
                pageIndex === data.pages.length - 1 &&
                itemIndex === page.data.length - 1;

              return (
                <BigPaint
                  key={it.id}
                  ref={hasNext && isLastEntry ? ref : undefined}
                  data={it}
                />
              );
            })}
          </Fragment>
        ))}
      </ul>
      {isFetchingNext && <span>loading next</span>}
    </>
  );
}
