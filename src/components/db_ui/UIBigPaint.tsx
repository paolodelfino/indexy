"use client";

import { ButtonLink } from "@/components/Button";
import { MoreHorizontalSquare02, PencilEdit01 } from "@/components/icons";
import { dateToString } from "@/utils/date";
import { Selectable } from "kysely";
import { BigPaint } from "kysely-codegen/dist/db";
import { useMemo } from "react";

// TODO: Supa double click to edit

export default function UIBigPaint({
  data,
  id,
}: {
  data: Pick<Selectable<BigPaint>, "name" | "date" | "id"> & {
    num_related_inspirations: string | null;
    num_related_big_paints: string | null;
  };
  id?: string;
}) {
  const date = useMemo(() => dateToString(data.date), [data.date]);

  return (
    /* TODO: Sarebbe meglio se fosse la lista ad aggiungere lo spacing tra gli elementi */
    <div id={id} className="my-2">
      <p className="hyphens-auto whitespace-pre-wrap break-words rounded-t bg-neutral-700 p-4">
        {data.name}
      </p>

      <div className="flex h-16 items-center gap-2 overflow-x-auto rounded-b bg-neutral-900 px-2">
        <p className="shrink-0 text-neutral-500">{date}</p>

        <div className="ml-2 flex">
          <ButtonLink
            color="ghost"
            href={`/pool/big_paint/${data.id}`}
            size="large"
            disabled={
              data.num_related_big_paints! <= "0" &&
              data.num_related_inspirations! <= "0"
            }
            classNames={{ button: "data-[disabled=false]:text-neutral-300" }}
          >
            <MoreHorizontalSquare02 />
          </ButtonLink>

          {/* <ButtonLink
            color="ghost"
            href={`/pool/big_paint/${data.id}`}
            size="large"
            disabled={data.num_related_big_paints! <= "0"}
            classNames={{ button: "data-[disabled=false]:text-neutral-300" }}
          >
            <Square />
          </ButtonLink> */}

          {/* <ButtonLink
            color="ghost"
            href={`/pool/big_paint/${data.id}`}
            size="large"
            disabled={data.num_related_inspirations! <= "0"}
            classNames={{ button: "data-[disabled=false]:text-neutral-300" }}
          >
            <InkStroke20Filled />
          </ButtonLink> */}

          <ButtonLink
            color="ghost"
            href={`/edit/big_paint/${data.id}`}
            size="large"
            classNames={{ button: "data-[disabled=false]:text-neutral-300" }}
          >
            <PencilEdit01 />
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
