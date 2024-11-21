import { useEffect, useId, useMemo, useRef } from "react";

// TODO: Mi sa che se fai form.reset() e hai fetchIfNoData a true, potrebbe partire un fetch indesiderato (perché lo vuoi fare tu, però in effetti dovrebbe essere la stessa cosa)
export default function <T extends Array<any>>({
  nextOffset,
  callback,
  fetchIfNoData,
  active,
  inactive,
  data,
  getId,
}: {
  nextOffset: number | undefined;
  data: T | undefined;
  fetchIfNoData: boolean;
  getId: (item: T[number]) => string;
  callback: () => void;
  active(): void;
  inactive(): void;
}) {
  const id = useId(); // TODO: Does it hurt performance? // TODO: Does this work if the component is opened twice simultaneously?
  const observer = useRef<IntersectionObserver>(null);

  const lastId = useMemo(() => {
    if (data === undefined || data.length <= 0) return undefined;
    return getId(data[data.length - 1]);
  }, [data, getId]);

  useEffect(() => {
    active();
    return () => inactive();
  }, []);

  useEffect(() => {
    if (nextOffset !== undefined) {
      if (data === undefined) {
        if (fetchIfNoData) callback();
      } else {
        if (data.length <= 0) callback();
        else {
          observer.current = new IntersectionObserver((entries, observer) => {
            if (entries[0].isIntersecting) {
              callback();

              observer.disconnect();
            }
          });
          const target = document.getElementById(`${id}_${lastId}`);
          observer.current.observe(target!);
        }
      }
    }

    return () => {
      observer.current?.disconnect();
      observer.current = null;
    };
  }, [nextOffset]);

  return id;
}
