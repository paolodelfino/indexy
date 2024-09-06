"use client";
import { Star } from "@/components/icons";
import { cn } from "@/utils/cn";
import { usePathname } from "next/navigation";
import { RefObject, useEffect, useState } from "react";

export default function Inspiration({
  data,
  ref,
  mode,
  setMode,
}: {
  data: { id: string; date: Date; content: string; highlight: boolean };
  ref?: RefObject<HTMLLIElement | null>;
  mode: "idle" | "edit";
  setMode: React.Dispatch<React.SetStateAction<"idle" | "edit">>;
}) {
  const dateTimeFormat = new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
  const [date, setDate] = useState("");
  useEffect(() => setDate(dateTimeFormat.format(data.date)), []);

  const pathname = usePathname();
  const isInspirationView = pathname.endsWith(`/${data.id}`);

  return (
    <li
      ref={ref}
      onClick={() => {
        if (mode === "edit") {
          window.open(`/edit/inspiration/${data.id}`, "_blank");
          setMode("idle");
        }
      }}
      className={cn(
        mode === "edit" &&
          "hover:relative hover:cursor-pointer hover:before:absolute hover:before:left-0 hover:before:top-0 hover:before:h-full hover:before:w-full hover:before:bg-blue-500/20 hover:before:ring hover:before:ring-inset",
        isInspirationView && "border border-blue-500/60",
      )}
    >
      <p className="hyphens-auto break-words bg-neutral-700 p-4">
        {data.content}
      </p>
      <div className="flex items-center justify-between pr-2">
        <div>
          <button
            disabled={mode === "edit" || isInspirationView}
            onClick={() => window.open(`/inspiration/${data.id}`, "_blank")}
            className="size-9 border border-white/20 text-neutral-300"
          >
            ...
          </button>
        </div>
        <div className="flex">
          <span className="text-neutral-500">{date}</span>
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
