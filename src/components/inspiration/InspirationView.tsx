"use client";
import { fetchInspirationsAction } from "@/actions/fetchInspirationsAction";
import Inspiration from "@/components/inspiration/Inspiration";
import { useApp } from "@/stores/useApp";
import { startTransition, useActionState, useEffect, useRef } from "react";

export default function InspirationView() {
  const [state, dispatch, isPending] = useActionState(fetchInspirationsAction, {
    success: true,
    data: { hasNext: true, inspirations: [] },
  });

  const observedEntry = useRef<HTMLLIElement>(null);
  const intersectionObserver = useRef<IntersectionObserver>(undefined);

  useEffect(() => {
    if (!state.success) {
      throw new Error("For some reason action state is unsuccessful");
    }

    if (state.data.inspirations.length > 0) {
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

  const setIsEmpty = useApp((state) => state.setIsEmpty);

  useEffect(() => {
    if (state.data) {
      setIsEmpty(state.data.inspirations.length === 0);
    }

    if (!!state.data?.inspirations.length && state.data.hasNext) {
      if (!intersectionObserver.current) {
        throw new Error("For some reason intersectionObserver doesn't exists");
      }

      if (!observedEntry.current) {
        throw new Error("For some reason observedEntry doesn't exists");
      }

      intersectionObserver.current.observe(observedEntry.current);
    }

    return () => {
      setIsEmpty(true);
    };
  }, [state]);

  if (!state.success) {
    // TODO: Handle differently, for example using a toast
    console.log(state.errors);
    return "Something went wrong. See the console";
  }

  return (
    <>
      {state.data.inspirations.length > 0 && (
        <ul>
          {state.data.inspirations.map((it, i) => {
            const isLastEntry = i === state.data.inspirations.length - 1;

            return (
              <Inspiration
                key={it.id}
                ref={
                  state.data.hasNext && isLastEntry ? observedEntry : undefined
                }
                data={it}
              />
            );
          })}
        </ul>
      )}
      {state.data.inspirations.length === 0 && !isPending && <span>empty</span>}
      {isPending && <span>loading</span>}
    </>
  );
}
