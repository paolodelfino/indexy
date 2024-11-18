import { useCallback, useEffect, useId, useRef } from "react";

// TODO: Mi sa che se fai form.reset() e hai fetchIfNoData a true, potrebbe partire un fetch indesiderato (perché lo vuoi fare tu, però in effetti dovrebbe essere la stessa cosa)
export default function yseInfiniteQuery({
  hasData,
  nextOffset,
  callback,
  lastId,
  fetchIfNoData,
  active,
  inactive,
}: {
  nextOffset: number | undefined;
  hasData: boolean;
  lastId: string | undefined;
  callback(): void;
  fetchIfNoData: boolean;
  active(): void;
  inactive(): void;
}) {
  const id = useId(); // TODO: Does it hurt performance? // TODO: Does this work if the component is opened twice simultaneously?
  const observer = useRef<IntersectionObserver>(null);

  const observeLast = useCallback(
    () =>
      observer.current!.observe(document.getElementById(`${id}_${lastId}`)!),
    [id, lastId],
  );

  useEffect(() => {
    active();
    return () => inactive();
  }, []);

  useEffect(() => {
    if (nextOffset !== undefined) {
      if (hasData) {
        observer.current = new IntersectionObserver((entries, observer) => {
          if (entries[0].isIntersecting) {
            callback();

            observer.disconnect();
          }
        });

        observeLast();
      } else if (fetchIfNoData) {
        callback();
      }
    }

    return () => {
      observer.current?.disconnect();
      observer.current = null;
    };
  }, [nextOffset]);

  return id;
}
