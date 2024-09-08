"use client";
import { cn } from "@/utils/cn";
import { usePathname } from "next/navigation";
import { RefObject, useEffect, useState } from "react";

export default function BigPaint({
  data,
  ref,
  mode,
  setMode,
}: {
  data: { id: string; date: Date; name: string };
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
  const isItsPage = pathname.endsWith(`/${data.id}`);

  return (
    <li
      ref={ref}
      onClick={() => {
        if (mode === "edit") {
          window.open(`/edit/${data.id}?type=big_paint`, "_blank");
          setMode("idle");
        }
      }}
      className={cn(
        mode === "edit" &&
          "hover:relative hover:cursor-pointer hover:before:absolute hover:before:left-0 hover:before:top-0 hover:before:h-full hover:before:w-full hover:before:bg-blue-500/20 hover:before:ring hover:before:ring-inset",
        isItsPage && "border border-blue-500",
      )}
    >
      <p className="hyphens-auto break-words bg-neutral-700 p-4">{data.name}</p>
      <div className="flex items-center justify-between pr-2">
        <div>
          <button
            disabled={mode === "edit" || isItsPage}
            onClick={() => window.open(`/${data.id}?type=big_paint`, "_blank")}
            className="size-9 border border-white/20 text-neutral-300"
          >
            ...
          </button>
        </div>
        <div className="flex">
          <span className="text-neutral-500">{date}</span>
        </div>
      </div>
    </li>
  );
}
