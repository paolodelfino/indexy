"use client";
import { ButtonLink } from "@/components/Button";
import { PencilEdit01 } from "@/components/icons";
import { cn } from "@/utils/cn";
import { Selectable } from "kysely";
import { BigPaint } from "kysely-codegen/dist/db";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function UIBigPaint({
  data,
  id,
}: {
  data: Omit<Selectable<BigPaint>, "related_big_paints_ids">; // TODO: Do something about this ommited params
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
  const isItsPage = pathname.endsWith(`${data.id}/big_paint`);

  return (
    <div id={id} className={cn(isItsPage && "border border-blue-500")}>
      <p className="hyphens-auto break-words bg-neutral-700 p-4">{data.name}</p>
      <div className="flex items-center justify-between pr-2">
        <div className="flex">
          <ButtonLink
            color="ghost"
            href={`/${data.id}/big_paint`}
            disabled={isItsPage}
            classNames={{
              button: "text-neutral-300 size-9 justify-center items-center",
            }}
          >
            ...
          </ButtonLink>
          <ButtonLink
            color="ghost"
            href={`/edit/${data.id}/big_paint`}
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
