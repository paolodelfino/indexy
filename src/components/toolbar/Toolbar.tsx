"use client";
import {
  Add02,
  InkStroke20Filled,
  PencilEdit01,
  SearchSquare,
  Square,
} from "@/components/icons";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/popover";
import { useApp } from "@/stores/useApp";
import { cn } from "@/utils/cn";
import { useHotkeys, useMediaQuery } from "@mantine/hooks";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Toolbar({
  variant,
}: {
  variant: "monitor" | "mobile";
}) {
  const [mode, changeMode, isEditAvailable] = useApp((state) => [
    state.mode,
    state.changeMode,
    state.isEditAvailable,
  ]);

  const toggleEdit = () => {
    if (!isEditAvailable) return;

    changeMode((curr) => (curr === "edit" ? "idle" : "edit"));
  };

  useHotkeys([["mod+shift+x", toggleEdit]]);

  const isMonitor = useMediaQuery("(min-width: 1600px)", false);

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [url, setUrl] = useState("");

  useEffect(() => {
    const search = searchParams.toString();
    const url = `${pathname}${search ? `?${search}` : ""}`;
    setUrl(url);
  }, [pathname, searchParams]);

  return (
    <header
      className={cn(
        variant === "mobile" &&
          "fixed bottom-0 max-h-16 w-full max-w-4xl bg-black monitor:hidden",
        variant === "monitor" && "sticky top-0 hidden monitor:block",
      )}
    >
      <nav
        className={cn(
          variant === "mobile" && "overflow-x-auto scrollbar-hidden",
        )}
      >
        <ul className={cn("flex", variant === "monitor" && "flex-col")}>
          <Link
            href="/?view=big_paint"
            role="listitem"
            className="flex gap-2 px-3 py-5 ring-neutral-600 hover:bg-neutral-600 active:bg-neutral-700"
          >
            <Square />
            <span className="text-neutral-300">BigPaints</span>
          </Link>
          <Link
            href="/?view=inspiration"
            role="listitem"
            className="flex gap-2 px-3 py-5 ring-neutral-600 hover:bg-neutral-600 active:bg-neutral-700"
          >
            <InkStroke20Filled />
            <span className="text-neutral-300">Inspirations</span>
          </Link>
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
              <Link
                href={`${isMonitor && !url.startsWith("/create") ? "/redirect?url=" : ""}/create?type=big_paint`}
                // target="_blank"
                role="listitem"
                className="flex gap-2 bg-neutral-800 p-3 ring-1 ring-neutral-600 hover:bg-neutral-600 hover:ring-0 active:bg-neutral-700 active:ring-1"
              >
                <Square />
                <span className="text-neutral-300">BigPaint</span>
              </Link>
              <Link
                href={`${isMonitor && !url.startsWith("/create") ? "/redirect?url=" : ""}/create?type=inspiration`}
                // target="_blank"
                role="listitem"
                className="flex gap-2 bg-neutral-800 p-3 ring-1 ring-neutral-600 hover:bg-neutral-600 hover:ring-0 active:bg-neutral-700 active:ring-1"
              >
                <InkStroke20Filled />
                <span className="text-neutral-300">Inspiration</span>
              </Link>
            </PopoverContent>
          </Popover>
          {isEditAvailable && (
            <button
              role="listitem"
              className="flex gap-2 px-3 py-5 ring-neutral-600 hover:bg-neutral-600 active:bg-neutral-700"
              onClick={toggleEdit}
            >
              <PencilEdit01 className={cn(mode === "edit" && "fill-current")} />
              <span className="text-neutral-300">Edit</span>
            </button>
          )}
          <Popover placement="left-start">
            <PopoverTrigger
              role="listitem"
              className="flex gap-2 px-3 py-5 ring-neutral-600 hover:bg-neutral-600 active:bg-neutral-700"
            >
              <SearchSquare />
              <span className="text-neutral-300">Search</span>
            </PopoverTrigger>
            <PopoverContent
              className="z-20 flex min-w-16 max-w-[160px] flex-col"
              role="list"
            >
              <Link
                href="/search?type=big_paint"
                role="listitem"
                className="flex gap-2 bg-neutral-800 p-3 ring-1 ring-neutral-600 hover:bg-neutral-600 hover:ring-0 active:bg-neutral-700 active:ring-1"
              >
                <Square />
                <span className="text-neutral-300">BigPaint</span>
              </Link>
              <Link
                href="/search?type=inspiration"
                role="listitem"
                className="flex gap-2 bg-neutral-800 p-3 ring-1 ring-neutral-600 hover:bg-neutral-600 hover:ring-0 active:bg-neutral-700 active:ring-1"
              >
                <InkStroke20Filled />
                <span className="text-neutral-300">Inspiration</span>
              </Link>
            </PopoverContent>
          </Popover>
        </ul>
      </nav>
    </header>
  );
}
