"use client";
import { fetchBigPaintsAction } from "@/actions/fetchBigPaintsAction";
import BigPaint from "@/components/big_paint/BigPaint";
import { useApp } from "@/stores/useApp";
import { useHotkeys } from "@mantine/hooks";
import { startTransition, useActionState, useEffect, useRef } from "react";

export default function BigPaintView() {
  const [state, dispatch, isPending] = useActionState(fetchBigPaintsAction, {
    success: true,
    data: { hasNext: true, bigPaints: [] },
  });

  const observedEntry = useRef<HTMLLIElement>(null);
  const intersectionObserver = useRef<IntersectionObserver>(undefined);

  useEffect(() => {
    if (!state.success) {
      throw new Error("For some reason action state is unsuccessful");
    }

    if (state.data.bigPaints.length > 0) {
      throw new Error(
        "For some reason Inspiration array length is greater than 0",
      );
    }

    startTransition(() => {
      dispatch();
    });

    if (intersectionObserver.current) {
      throw new Error("For some reason intersectionObserver already exists");
    }

    intersectionObserver.current = new IntersectionObserver(
      (entries, observer) => {
        if (entries.length > 1) {
          throw new Error(
            "For some reason intersectionObserver's entries are more than 1",
          );
        }

        const entry = entries[0];

        if (!entry) {
          throw new Error(
            "For some reason intersectionObserver's entry doesn't exist",
          );
        }

        if (entry.isIntersecting) {
          observer.disconnect();
          startTransition(() => {
            dispatch();
          });
        }
      },
    );
  }, []);

  const { setIsEmpty, mode, changeMode } = useApp();

  useEffect(() => {
    if (state.data) {
      setIsEmpty(state.data.bigPaints.length === 0);
    }

    if (!!state.data?.bigPaints.length && state.data.hasNext) {
      if (!intersectionObserver.current) {
        throw new Error("For some reason intersectionObserver doesn't exists");
      }

      if (!observedEntry.current) {
        throw new Error("For some reason observedEntry doesn't exists");
      }

      intersectionObserver.current.observe(observedEntry.current);
    }
  }, [state]);

  function toggleEdit() {
    if (state.success && state.data.bigPaints.length > 0) {
      changeMode((curr) => (curr === "edit" ? "idle" : "edit"));
    }
  }

  useHotkeys([["mod+shift+x", toggleEdit]]);

  if (!state.success) {
    // TODO: Handle differently, for example using a toast
    console.log(state.errors);
    return "Something went wrong. See the console";
  }

  return (
    <>
      {state.data.bigPaints.length > 0 && (
        <ul>
          {state.data.bigPaints.map((it, i) => {
            const isLastEntry = i === state.data.bigPaints.length - 1;

            return (
              <BigPaint
                key={it.id}
                ref={
                  state.data.hasNext && isLastEntry ? observedEntry : undefined
                }
                data={it}
                mode={mode}
                setMode={changeMode}
              />
            );
          })}
        </ul>
      )}
      {state.data.bigPaints.length === 0 && !isPending && <span>empty</span>}
      {isPending && <span>loading</span>}
    </>
  );
}
