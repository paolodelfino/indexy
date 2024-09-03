"use client";
import { Star } from "@/components/icons";
import { cn } from "@/utils/cn";
import { Selectable } from "kysely";
import { DB } from "kysely-codegen/dist/db";
import { RefObject } from "react";

export default function Inspiration({
  data,
  ref,
  mode,
  setMode,
}: {
  data: Selectable<DB["inspiration"]>;
  ref?: RefObject<HTMLLIElement | null>;
  mode: "idle" | "edit";
  setMode: React.Dispatch<React.SetStateAction<"idle" | "edit">>;
}) {
  // const router = useRouter();

  return (
    <li
      ref={ref}
      // onMouseOver={() => {
      //   if (mode === "edit") {
      //     router.prefetch(`/edit/${data.id}`);
      //   }
      // }}
      // onTouchMove={() => {
      //   if (mode === "edit") {
      //     router.prefetch(`/edit/${data.id}`);
      //   }
      // }}
      onClick={() => {
        if (mode === "edit") {
          // router.push(`/edit/${data.id}`);
          window.open(`/edit/${data.id}`, "_blank");
          setMode("idle");
        }
      }}
      className={cn(
        mode === "edit" &&
          "hover:relative hover:cursor-pointer hover:before:absolute hover:before:left-0 hover:before:top-0 hover:before:h-full hover:before:w-full hover:before:bg-blue-500/20 hover:before:ring hover:before:ring-inset",
      )}
    >
      <p className="hyphens-auto break-words bg-neutral-700 p-4">
        {data.content}
      </p>
      <div className="flex items-center justify-between pr-2">
        <div>
          <button
            disabled={mode === "edit"}
            className="size-9 border border-white/20 text-neutral-300"
          >
            ...
          </button>
        </div>
        <div className="flex">
          <span className="text-neutral-500">{data.date.toUTCString()}</span>
          <button
            disabled={mode === "edit"}
            aria-label="Toggle highlight"
            className="pl-4 text-neutral-300"
          >
            <Star className={cn(data.highlight && "fill-current")} />
          </button>
        </div>
      </div>
    </li>
  );
}
