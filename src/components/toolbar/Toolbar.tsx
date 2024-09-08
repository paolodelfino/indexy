"use client";
import {
  Add02,
  InkStroke20Filled,
  PencilEdit01,
  Square,
} from "@/components/icons";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/popover";
import { useApp } from "@/stores/useApp";
import { cn } from "@/utils/cn";
import { useHotkeys } from "@mantine/hooks";

export default function Toolbar({
  variant,
}: {
  variant: "monitor" | "mobile";
}) {
  const { changeMode, isEmpty, mode } = useApp();

  const showEditOption = !isEmpty;

  const toggleEdit = () => {
    console.log("hllo", variant);

    if (!showEditOption) return;

    changeMode((curr) => (curr === "edit" ? "idle" : "edit"));
  };

  useHotkeys([["mod+shift+x", toggleEdit]]);

  return (
    <header
      className={cn(
        variant === "mobile" &&
          "fixed bottom-0 max-h-16 w-full max-w-4xl bg-black monitor:hidden",
        variant === "monitor" && "hidden monitor:block",
      )}
    >
      <nav
        className={cn(
          variant === "mobile" && "overflow-x-auto scrollbar-hidden",
        )}
      >
        <ul className={cn("flex", variant === "monitor" && "flex-col")}>
          <a
            href="/?view=big_paint"
            role="listitem"
            className="flex gap-2 px-3 py-5 ring-neutral-600 hover:bg-neutral-600 active:bg-neutral-700"
          >
            <Square />
            <span className="text-neutral-300">BigPaints</span>
          </a>
          <a
            href="/?view=inspiration"
            role="listitem"
            className="flex gap-2 px-3 py-5 ring-neutral-600 hover:bg-neutral-600 active:bg-neutral-700"
          >
            <InkStroke20Filled />
            <span className="text-neutral-300">Inspirations</span>
          </a>
          <Popover placement="left-start">
            <PopoverTrigger
              role="listitem"
              className="flex gap-2 px-3 py-5 ring-neutral-600 hover:bg-neutral-600 active:bg-neutral-700"
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
          {showEditOption && (
            <button
              role="listitem"
              className="flex gap-2 px-3 py-5 ring-neutral-600 hover:bg-neutral-600 active:bg-neutral-700"
              onClick={toggleEdit}
            >
              <PencilEdit01 className={cn(mode === "edit" && "fill-current")} />
              <span className="text-neutral-300">Edit</span>
            </button>
          )}
        </ul>
      </nav>
    </header>
  );
}
