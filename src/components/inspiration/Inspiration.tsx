"use client";
import Button from "@/components/Button";
import { Star } from "@/components/icons";
import { useApp } from "@/stores/useApp";
import { cn } from "@/utils/cn";
import { useMediaQuery } from "@mantine/hooks";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Inspiration({
  data,
  ref,
}: {
  data: { id: string; date: Date; content: string; highlight: boolean };
  ref?: (node?: Element | null) => void;
}) {
  // TODO: Date doesn't update
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

  const router = useRouter();

  const isMonitor = useMediaQuery("(min-width: 1600px)", false);

  const searchParams = useSearchParams();
  const [url, setUrl] = useState("");

  useEffect(() => {
    const search = searchParams.toString();
    const url = `${pathname}${search ? `?${search}` : ""}`;
    setUrl(url);
  }, [pathname, searchParams]);

  const [mode, changeMode] = useApp((state) => [state.mode, state.changeMode]);

  return (
    <li
      ref={ref}
      onClick={() => {
        if (mode === "edit") {
          const endpoint = `/edit/${data.id}?type=inspiration`;
          router.push(
            `${isMonitor && url !== endpoint ? "/redirect?url=" : ""}${endpoint}`,
          );
          // window.open(`/edit/${data.id}?type=inspiration`, "_blank");
          changeMode("idle");
        }
      }}
      className={cn(
        mode === "edit" &&
          "hover:relative hover:cursor-pointer hover:before:absolute hover:before:left-0 hover:before:top-0 hover:before:h-full hover:before:w-full hover:before:bg-blue-500/20 hover:before:ring hover:before:ring-inset",
        isItsPage && "border border-blue-500",
      )}
    >
      <p className="hyphens-auto break-words bg-neutral-700 p-4">
        {data.content}
      </p>
      <div className="flex items-center justify-between pr-2">
        <div>
          <Link
            href={
              mode === "edit" || isItsPage
                ? "#"
                : `${isMonitor && url !== `/${data.id}?type=inspiration` ? "/redirect?url=" : ""}${`/${data.id}?type=inspiration`}`
            }
            aria-disabled={mode === "edit" || isItsPage}
            className={cn(
              "block size-9 border border-white/20 text-center text-neutral-300",
              (mode === "edit" || isItsPage) && "pointer-events-none",
            )}
          >
            ...
          </Link>
        </div>
        <div className="flex">
          <span className="text-neutral-500">{date}</span>
          <Button
            disabled={mode === "edit"}
            aria-label="Toggle highlight"
            className="pl-4 text-neutral-300"
          >
            <Star className={cn(data.highlight && "fill-current")} />
          </Button>
        </div>
      </div>
    </li>
  );
}
