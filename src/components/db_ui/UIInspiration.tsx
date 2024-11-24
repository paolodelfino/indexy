"use client";
import Button, { ButtonLink } from "@/components/Button";
import { PencilEdit01, Star } from "@/components/icons";
import { cn } from "@/utils/cn";
import { Selectable } from "kysely";
import { Inspiration } from "kysely-codegen/dist/db";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function UIInspiration({
  data,
  id,
}: {
  data: Pick<
    Selectable<Inspiration>,
    "id" | "content" | "date" | "highlight" // TODO: Include omitted
  >;
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
  const isItsPage = pathname.endsWith(`/${data.id}/inspiration`);

  return (
    <div id={id} className={cn(isItsPage && "border border-blue-500")}>
      <p className="hyphens-auto break-words bg-neutral-700 p-4">
        {data.content}
      </p>
      <div className="flex items-center justify-between pr-2">
        <div className="flex">
          <ButtonLink
            color="ghost"
            href={`/${data.id}/inspiration`}
            disabled={isItsPage}
            classNames={{
              button: "text-neutral-300 size-9 justify-center items-center",
            }}
          >
            ...
          </ButtonLink>
          <ButtonLink
            color="ghost"
            href={`/edit/${data.id}/inspiration`}
            classNames={{ button: "size-9 justify-center items-center" }}
          >
            <PencilEdit01 className="text-neutral-300" />
          </ButtonLink>
        </div>
        <div className="flex items-center">
          <span className="text-neutral-500">{date}</span>
          <Button
            color="ghost"
            aria-label="Toggle highlight"
            classNames={{ button: "pl-4 text-neutral-300" }}
          >
            <Star className={cn(data.highlight && "fill-current")} />
          </Button>
        </div>
      </div>
    </div>
  );
}
