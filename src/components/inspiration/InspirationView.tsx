"use client";
import { fetchInspirationsAction } from "@/actions/fetchInspirationsAction";
import {
  Add02,
  InkStroke20Filled,
  MenuSquare,
  PencilEdit01,
  Square,
} from "@/components/icons";
import Inspiration from "@/components/inspiration/Inspiration";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/popover";
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

  function toggleEdit() {
    if (state.success && state.data.inspirations.length > 0) {
      setMode((curr) => (curr === "edit" ? "idle" : "edit"));
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
      <Popover placement="top-end">
        <PopoverTrigger
          aria-label="Toggle menu"
          className="fixed bottom-2 right-2 max-w-32 overflow-hidden text-ellipsis whitespace-nowrap rounded-full bg-neutral-800 p-1 opacity-50 ring-1 ring-neutral-600 hover:bg-neutral-600 hover:ring-0 active:bg-neutral-700 active:ring-1"
          title="mod+shift+x"
        >
          <MenuSquare />
        </PopoverTrigger>
        <PopoverContent
          className="z-20 flex min-w-16 max-w-[160px] flex-col"
          role="list"
        >
          <a
            href="/?view=big_paint"
            role="listitem"
            className="flex gap-2 bg-neutral-800 p-3 ring-1 ring-neutral-600 hover:bg-neutral-600 hover:ring-0 active:bg-neutral-700 active:ring-1"
          >
            <Square />
            <span className="text-neutral-300">BigPaints</span>
          </a>
          <a
            href="/?view=inspiration"
            role="listitem"
            className="flex gap-2 bg-neutral-800 p-3 ring-1 ring-neutral-600 hover:bg-neutral-600 hover:ring-0 active:bg-neutral-700 active:ring-1"
          >
            <InkStroke20Filled />
            <span className="text-neutral-300">Inspirations</span>
          </a>
          <Popover placement="left-start">
            <PopoverTrigger
              role="listitem"
              className="flex gap-2 bg-neutral-800 p-3 ring-1 ring-neutral-600 hover:bg-neutral-600 hover:ring-0 active:bg-neutral-700 active:ring-1"
            >
              <Add02 />
              <span className="text-neutral-300">Create</span>
            </PopoverTrigger>
            <PopoverContent
              className="z-20 flex min-w-16 max-w-[160px] flex-col"
              role="list"
            >
              <a
                href="/create?type=big_paint"
                target="_blank"
                role="listitem"
                className="flex gap-2 bg-neutral-800 p-3 ring-1 ring-neutral-600 hover:bg-neutral-600 hover:ring-0 active:bg-neutral-700 active:ring-1"
              >
                <Square />
                <span className="text-neutral-300">BigPaint</span>
              </a>
              <a
                href="/create?type=inspiration"
                target="_blank"
                role="listitem"
                className="flex gap-2 bg-neutral-800 p-3 ring-1 ring-neutral-600 hover:bg-neutral-600 hover:ring-0 active:bg-neutral-700 active:ring-1"
              >
                <InkStroke20Filled />
                <span className="text-neutral-300">Inspiration</span>
              </a>
            </PopoverContent>
          </Popover>
          {state.data.inspirations.length > 0 && (
            <button
              role="listitem"
              className="flex gap-2 bg-neutral-800 p-3 ring-1 ring-neutral-600 hover:bg-neutral-600 hover:ring-0 active:bg-neutral-700 active:ring-1"
              onClick={toggleEdit}
            >
              <PencilEdit01 className={cn(mode === "edit" && "fill-current")} />
              <span className="text-neutral-300">Edit</span>
            </button>
          )}
        </PopoverContent>
      </Popover>
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
