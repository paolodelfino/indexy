"use client";

import { ButtonLink } from "@/components/Button";
import {
  BinaryCode,
  MoreHorizontalSquare02,
  PencilEdit01,
  Star,
} from "@/components/icons";
import { cn } from "@/utils/cn";
import { dateToString } from "@/utils/date";
import { Selectable } from "kysely";
import { Inspiration, Resource } from "kysely-codegen/dist/db";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useMemo, useState } from "react";

// TODO: Supa double click to edit
// TODO: Maybe fetch resources on mount (when visible). Use query for caching and revalidation (o si usa un Set senza modificare la lib oppure si modifica la lib o una semplice estensione)

export default function UIInspiration({
  data,
  id,
}: {
  data: Pick<
    Selectable<Inspiration>,
    "content" | "date" | "id" | "highlight"
  > & {
    resources: (Pick<Selectable<Resource>, "id" | "type" | "sha256" | "n"> & {
      buff: ArrayBuffer;
    })[];
    num_related_inspirations: string | null;
    num_related_big_paints: string | null;
  };
  id?: string;
}) {
  const [contentNodes, setContentNodes] = useState<ReactNode[]>([]);

  useEffect(() => {
    let key = 0;
    let b: ReactNode[] = [];

    for (let i = 0; i < data.content.length; ++i) {
      if (data.content[i] === "$") {
        if (data.content[i + 1] === "$") {
          b.push(<span key={key++}>$</span>);
          i++;
        } else {
          let j = i + 1;
          while (
            j < data.content.length &&
            data.content[j] >= "0" &&
            data.content[j] <= "9"
          )
            j++;
          const n = parseInt(data.content.slice(i + 1, j));
          if (!Number.isNaN(n)) {
            const res = data.resources.find((u) => u.n === n);
            if (res !== undefined) {
              // TODO: Handle empty, invalid binary
              if (res.type === "image")
                b.push(
                  <ImageView
                    key={key++}
                    data={{ buff: res.buff, id: res.id }}
                  />,
                );
              else b.push(<BinaryView key={key++} data={{ id: res.id }} />);
            } else b.push(<span key={key++}>{data.content.slice(i, j)}</span>);
          } else {
            b.push(<span key={key++}>$</span>);
          }
          i = j - 1;
        }
      } else {
        let j = i;
        while (j < data.content.length && data.content[j] !== "$") j++;
        b.push(<span key={key++}>{data.content.slice(i, j)}</span>);
        i = j - 1;
      }
    }

    setContentNodes(b);
  }, [data.content]);

  const date = useMemo(() => dateToString(data.date), [data.date]);

  const pathname = usePathname();
  const isItsPage = useMemo(
    () => pathname === `/pool/inspiration/${data.id}`,
    [pathname],
  );

  return (
    /* TODO: Sarebbe meglio se fosse la lista ad aggiungere lo spacing tra gli elementi */
    <div id={id} className="my-2">
      <div className="hyphens-auto whitespace-pre-wrap break-words rounded-t bg-neutral-700 p-4">
        {contentNodes}
      </div>

      <div className="flex h-16 items-center gap-2 overflow-x-auto rounded-b bg-neutral-900 px-2">
        <p className="shrink-0 text-neutral-500">{date}</p>

        <p>{<Star className={cn(data.highlight && "fill-current")} />}</p>

        {isItsPage && <span className="h-2 w-2 rounded-full bg-blue-500" />}

        <div className="ml-2 flex">
          <ButtonLink
            color="ghost"
            href={`/pool/inspiration/${data.id}`}
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
            href={`/pool/inspiration/${data.id}`}
            size="large"
            disabled={data.num_related_big_paints! <= "0"}
            classNames={{ button: "data-[disabled=false]:text-neutral-300" }}
          >
            <Square />
          </ButtonLink>

          <ButtonLink
            color="ghost"
            href={`/pool/inspiration/${data.id}`}
            size="large"
            disabled={data.num_related_inspirations! <= "0"}
            classNames={{ button: "data-[disabled=false]:text-neutral-300" }}
          >
            <InkStroke20Filled />
          </ButtonLink> */}

          <ButtonLink
            color="ghost"
            href={`/edit/inspiration/${data.id}`}
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

// TODO: Add intercepting route
// TODO: Optimization type based (for example, BinaryView doesn't currently need the buffer)

function ImageView({
  data,
}: {
  data: Pick<Selectable<Resource>, "id"> & { buff: ArrayBuffer };
}) {
  const [base64, setBase64] = useState("");

  useEffect(() => {
    const bin = new Uint8Array(data.buff).reduce(
      (bin, byte) => (bin += String.fromCharCode(byte)),
      "",
    );
    setBase64(btoa(bin));
  }, [data.buff]);

  return (
    <ButtonLink
      href={`/res/${data.id}`}
      target="_blank"
      classNames={{ button: "w-max p-0 m-0 inline-flex" }}
    >
      <img src={`data:image;base64,${base64}`} width={48} className="inline" />
    </ButtonLink>
  );
}

function BinaryView({ data }: { data: Pick<Selectable<Resource>, "id"> }) {
  return (
    <ButtonLink
      href={`/res/${data.id}`}
      target="_blank"
      classNames={{ button: "inline-flex", text: "inline" }}
    >
      <BinaryCode />
    </ButtonLink>
  );
}
