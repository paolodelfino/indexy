"use client";
import BigPaint from "@/components/big_paint/BigPaint";
import {
  Add02,
  InkStroke20Filled,
  MenuSquare,
  PencilEdit01,
  Square,
} from "@/components/icons";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/popover";
import { cn } from "@/utils/cn";
import { useHotkeys } from "@mantine/hooks";
import { useState } from "react";

export default function TempBigPaintView({
  data,
}: {
  data: { id: string; name: string; date: Date }[];
}) {
  const [mode, setMode] = useState<"idle" | "edit">("idle");

  function toggleEdit() {
    if (data.length > 0) {
      setMode((curr) => (curr === "edit" ? "idle" : "edit"));
    }
  }

  useHotkeys([["mod+shift+x", toggleEdit]]);

  if (data.length === 0) {
    return "empty";
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
                href="/create/inspiration"
                target="_blank"
                role="listitem"
                className="flex gap-2 bg-neutral-800 p-3 ring-1 ring-neutral-600 hover:bg-neutral-600 hover:ring-0 active:bg-neutral-700 active:ring-1"
              >
                <InkStroke20Filled />
                <span className="text-neutral-300">Inspiration</span>
              </a>
              <a
                href="/create/big_paint"
                target="_blank"
                role="listitem"
                className="flex gap-2 bg-neutral-800 p-3 ring-1 ring-neutral-600 hover:bg-neutral-600 hover:ring-0 active:bg-neutral-700 active:ring-1"
              >
                <Square />
                <span className="text-neutral-300">BigPaint</span>
              </a>
            </PopoverContent>
          </Popover>
          {data.length > 0 && (
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
      {data.length > 0 && (
        <ul>
          {data.map((it, i) => {
            return (
              <BigPaint key={it.id} data={it} mode={mode} setMode={setMode} />
            );
          })}
        </ul>
      )}
    </>
  );
}
