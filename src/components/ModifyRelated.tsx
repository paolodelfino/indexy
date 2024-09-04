"use client";
import { searchBigPaintsAction } from "@/actions/searchBigPaintsAction";
import { searchInspirationsAction } from "@/actions/searchInspirationsAction";
import { startTransition, useActionState, useState } from "react";

export default function ModifyRelated({
  mode,
  currentRelated,
}: {
  mode: "bigPaint" | "inspiration";
  currentRelated: { id: string; name: string }[];
}) {
  const [state, dispatch, isPending] = useActionState(
    mode === "bigPaint" ? searchBigPaintsAction : searchInspirationsAction,
    {
      success: true,
      data: [],
    },
  );

  const [selected, setSelected] =
    useState<{ id: string; name: string }[]>(currentRelated);

  if (!state.success) {
    // TODO: Handle differently, for example using a toast
    console.log(state.errors);
    return "Something went wrong. See the console";
  }

  // TODO: Factor out the styles (only styles without element) for buttons (and other components like pillols) maybe using tailwind-variants

  return (
    <>
      <select
        multiple
        className="hidden"
        name={`related_${mode === "bigPaint" ? "big_paints" : "inspirations"}_ids`}
        value={selected.map((it) => it.id)}
        // @ts-expect-error
        readOnly
        aria-label="Native select (hidden)"
      >
        {selected.map((it) => (
          <option key={it.id} value={it.id} />
        ))}
      </select>
      <div className="space-y-6 px-3 py-5 7xl:px-0">
        <h2 className="text-lg font-medium">
          Related {mode === "bigPaint" ? "BigPaints" : "Inspirations"}
        </h2>
        <div
          className="flex flex-wrap gap-1.5"
          role="list"
          aria-label={`List of selected related ${mode === "bigPaint" ? "bigpaints" : "inspirations"}`}
        >
          {selected.map((it) => {
            return (
              <button
                role="listitem"
                type="button"
                key={it.id}
                title={it.name}
                className="max-w-32 overflow-hidden text-ellipsis whitespace-nowrap rounded-full bg-neutral-800 px-3 ring-1 ring-neutral-600 hover:bg-neutral-600 hover:ring-0 active:bg-neutral-700 active:ring-1"
                aria-label={`Related selected ${mode === "bigPaint" ? "bigpaint" : "inspiration"}`}
                onClick={() =>
                  setSelected((selected) =>
                    selected.filter((it2) => it2.id !== it.id),
                  )
                }
              >
                {it.name}
              </button>
            );
          })}
        </div>
        <div>
          <input
            type="search"
            className="h-10 w-full rounded-none px-2"
            required
            disabled={isPending}
            form="unexisting"
            name={`Search input for ${mode === "bigPaint" ? "bigpaints" : "inspirations"}`}
            onKeyDown={(e) => {
              if (
                e.code === "Enter" &&
                e.currentTarget.value.trim().length > 0
              ) {
                startTransition(() => {
                  const payload = new FormData();
                  payload.set("query", e.currentTarget.value);
                  dispatch(payload);
                });
              }
            }}
          />
          {state.data.length > 0 && !isPending && (
            <ul>
              {state.data.map((it) => {
                return (
                  <button
                    role="listitem"
                    key={it.id}
                    className="w-full hyphens-auto break-words bg-neutral-800 p-2 px-2 text-start ring-1 ring-neutral-600 disabled:text-neutral-500 [&:not(:disabled):active]:bg-neutral-700 [&:not(:disabled):active]:ring-1 [&:not(:disabled):hover]:bg-neutral-600 [&:not(:disabled):hover]:ring-0"
                    type="button"
                    disabled={
                      selected.findIndex((it2) => it2.id === it.id) !== -1
                    }
                    onClick={() =>
                      setSelected((selected) => {
                        return [...selected, it];
                      })
                    }
                  >
                    {it.name}
                  </button>
                );
              })}
            </ul>
          )}
          {state.data.length === 0 && !isPending && <span>empty</span>}
          {isPending && <span>loading</span>}
        </div>
      </div>
    </>
  );
}
