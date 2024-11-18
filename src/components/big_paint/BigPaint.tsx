"use client";
import { ButtonLink } from "@/components/Button";
import { PencilEdit01 } from "@/components/icons";
import { cn } from "@/utils/cn";
import { useMediaQuery } from "@mantine/hooks";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function BigPaint({
  data,
  id,
}: {
  data: { id: string; date: Date; name: string };
  id?: string;
}) {
  // TODO: date doesnt't get updated
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

  const isMonitor = useMediaQuery("(min-width: 1600px)", false);

  const searchParams = useSearchParams();
  const [url, setUrl] = useState("");

  useEffect(() => {
    const search = searchParams.toString();
    const url = `${pathname}${search ? `?${search}` : ""}`;
    setUrl(url);
    // console.log(decodeURI(url));
  }, [pathname, searchParams]);

  return (
    <div id={id} className={cn(isItsPage && "border border-blue-500")}>
      <p className="hyphens-auto break-words bg-neutral-700 p-4">{data.name}</p>
      <div className="flex items-center justify-between pr-2">
        <div className="flex">
          <ButtonLink
            color="ghost"
            href={`${isMonitor && url !== `/${data.id}?type=big_paint` ? "/redirect?url=" : ""}${`/${data.id}?type=big_paint`}`}
            data-disabled={isItsPage}
            classNames={{
              button: cn(
                "text-neutral-300 size-9 justify-center items-center",
                isItsPage && "pointer-events-none",
              ),
            }}
          >
            ...
          </ButtonLink>
          <ButtonLink
            color="ghost"
            href={`${isMonitor && url !== `/edit/${data.id}?type=big_paint` ? "/redirect?url=" : ""}${`/edit/${data.id}?type=big_paint`}`}
            classNames={{ button: "size-9 justify-center items-center" }}
          >
            <PencilEdit01 className="text-neutral-300" />
          </ButtonLink>
        </div>
        <div className="flex">
          <span className="text-neutral-500">{date}</span>
        </div>
      </div>
    </div>
  );
}
