"use client";
import { fetchInspirationsAction } from "@/actions/fetchInspirationsAction";
import { PencilEdit01 } from "@/components/icons";
import Inspiration from "@/components/inspiration/Inspiration";
import { cn } from "@/utils/cn";
import { useHotkeys } from "@mantine/hooks";
import {
  startTransition,
  useActionState,
  useEffect,
  useRef,
  useState,
} from "react";

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

  useEffect(() => {
    if (!!state.data?.inspirations.length && state.data.hasNext) {
      if (!intersectionObserver.current) {
        throw new Error("For some reason intersectionObserver doesn't exists");
      }

      if (!observedEntry.current) {
        throw new Error("For some reason observedEntry doesn't exists");
      }

      intersectionObserver.current.observe(observedEntry.current);
    }
  }, [state]);

  const [mode, setMode] = useState<"idle" | "edit">("idle");

  function handleChangeMode() {
    if (state.success && state.data.inspirations.length > 0) {
      setMode((curr) => (curr === "edit" ? "idle" : "edit"));
    }
  }

  useHotkeys([["mod+shift+x", handleChangeMode]]);

  if (!state.success) {
    // TODO: Handle differently, for example using a toast
    console.log(state.errors);
    return "Something went wrong. See the console";
  }

  return (
    <>
      {state.data.inspirations.length > 0 && (
        <button
          aria-label="Toggle edit mode"
          onClick={handleChangeMode}
          className="fixed bottom-2 right-2 max-w-32 overflow-hidden text-ellipsis whitespace-nowrap rounded-full bg-neutral-800 p-1 opacity-50 ring-1 ring-neutral-600 hover:bg-neutral-600 hover:ring-0 active:bg-neutral-700 active:ring-1"
          title="mod+shift+x"
        >
          <PencilEdit01 className={cn(mode === "edit" && "fill-current")} />
        </button>
      )}
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
                mode={mode}
                setMode={setMode}
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
