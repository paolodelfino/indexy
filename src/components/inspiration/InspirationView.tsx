"use client";
import Inspiration from "@/components/inspiration/Inspiration";
import useInspirationQuery from "@/stores/useInspirationViewQuery";
import { useEffect, useId, useRef } from "react";

// TODO: Combine with the temporary version
export default function InspirationView() {
  const query = useInspirationQuery();
  const observer = useRef<IntersectionObserver>(null);
  const id = useId();

  useEffect(() => {
    query.active();

    if (query.data === undefined) query.fetch();

    return () => query.inactive();
  }, []);

  useEffect(() => {
    if (query.nextOffset !== undefined && query.data !== undefined) {
      observer.current = new IntersectionObserver((entries, observer) => {
        if (entries[0].isIntersecting) {
          query.fetch();

          observer.disconnect();
        }
      });

      observer.current!.observe(
        document.getElementById(
          `${id}_${query.data[query.data.length - 1].id}`,
        )!,
      );
    }

    return () => {
      observer.current?.disconnect();
      observer.current = null;
    };
  }, [query.nextOffset]);

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
