"use client";

import Button, { ButtonLink } from "@/components/Button";
import UIBigPaint from "@/components/db_ui/UIBigPaint";
import { Dialog } from "@/components/Dialog";
import {
  ArrowShrink,
  BinaryCode,
  InkStroke20Filled,
  PencilEdit01,
  Square,
  Star,
} from "@/components/icons";
import { cn } from "@/utils/cn";
import { dateToString } from "@/utils/date";
import { Selectable } from "kysely";
import { BigPaint, Inspiration, Resource } from "kysely-codegen/dist/db";
import React, { ReactNode, useEffect, useMemo, useState } from "react";

// TODO: Supa double click to edit
export default function UIInspiration({
  data,
  id,
}: {
  data: Pick<
    Selectable<Inspiration>,
    "content" | "date" | "highlight" | "id"
  > & {
    resources: (Selectable<Resource> & { buff: ArrayBuffer })[];
    relatedBigPaints: Selectable<BigPaint>[];
    relatedInspirations: Selectable<Inspiration>[];
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
              // TODO: Empty, invalid binary
              if (res.type === "image")
                b.push(<ImageView key={key++} data={res} />);
              else b.push(<BinaryView key={key++} data={res} />);
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

  return (
    /* TODO: Sarebbe meglio se fosse la lista ad aggiungere lo spacing tra gli elementi */
    <div id={id} className="my-2">
      <div className="hyphens-auto whitespace-pre-wrap break-words rounded-t bg-neutral-700 p-4">
        {contentNodes}
      </div>

      <div className="flex h-16 items-center gap-2 overflow-x-auto rounded-b bg-neutral-900 px-2">
        <p className="shrink-0 text-neutral-500">{date}</p>

        <p>{<Star className={cn(data.highlight && "fill-current")} />}</p>

        <div className="ml-2 flex">
          {/* TODO: Lasciare qualcosa per la memoria visiva e muscolare */}
          {data.relatedBigPaints.length > 0 && (
            <Dialog
              trigger={(dialog) => (
                <Button
                  classNames={{ button: "max-w-32" }}
                  onClick={dialog.open}
                  color="ghost"
                  size="large"
                >
                  <Square />
                </Button>
              )}
              className="w-full max-w-4xl bg-transparent backdrop:bg-neutral-900/95"
              content={(dialog) => {
                return (
                  <React.Fragment>
                    <Button
                      onClick={dialog.close}
                      classNames={{ button: "ml-auto" }}
                      color="ghost"
                    >
                      <ArrowShrink />
                    </Button>

                    {/* TODO: Virtualization */}
                    {/* TODO: Resta sempre la questione di star passando troppo, immagina 1000 big paints per qualche motivo */}
                    <ul className="bg-black">
                      {data.relatedBigPaints.map((it) => (
                        <UIBigPaint key={it.id} data={it} />
                      ))}
                    </ul>
                  </React.Fragment>
                );
              }}
            />
          )}

          {/* TODO: Lasciare qualcosa per la memoria visiva e muscolare */}
          {data.relatedInspirations.length > 0 && (
            <Dialog
              trigger={(dialog) => (
                <Button
                  classNames={{ button: "max-w-32" }}
                  onClick={dialog.open}
                  color="ghost"
                  size="large"
                >
                  <InkStroke20Filled />
                </Button>
              )}
              className="w-full max-w-4xl bg-transparent backdrop:bg-neutral-900/95"
              content={(dialog) => {
                return (
                  <React.Fragment>
                    <Button
                      onClick={dialog.close}
                      classNames={{ button: "ml-auto" }}
                      color="ghost"
                    >
                      <ArrowShrink />
                    </Button>

                    {/* TODO: Virtualization */}
                    {/* TODO: Resta sempre la questione di star passando troppo, immagina 1000 big paints per qualche motivo */}
                    <ul className="bg-black">
                      {/* TODO: Implement */}
                      {/* TODO: Loadable related (lazy I mean of course) */}
                      {data.relatedInspirations.map((it) => (
                        <li key={it.id}>{it.content}</li>
                      ))}
                    </ul>
                  </React.Fragment>
                );
              }}
            />
          )}

          <ButtonLink
            color="ghost"
            href={`/edit/${data.id}/inspiration`}
            size="large"
          >
            <PencilEdit01 className="text-neutral-300" />
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}

function ImageView({
  data,
}: {
  data: Selectable<Resource> & { buff: ArrayBuffer };
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
    <Dialog
      trigger={(dialog) => (
        <img
          className="inline w-12 hover:cursor-pointer"
          src={`data:image;base64,${base64}`}
          onClick={dialog.open}
        />
      )}
      className="bg-transparent"
      content={(dialog) => (
        <React.Fragment>
          <Button
            classNames={{ button: "ml-auto" }}
            color="ghost"
            onClick={dialog.close}
          >
            <ArrowShrink />
          </Button>
          <img src={`data:image;base64,${base64}`} />
        </React.Fragment>
      )}
    />
  );
}

function BinaryView({
  data,
}: {
  data: Selectable<Resource> & { buff: ArrayBuffer };
}) {
  // TODO: Slow rendering with large data
  const [bin, setBin] = useState("");

  useEffect(() => {
    const bin = new Uint8Array(data.buff).reduce(
      (bin, byte) => (bin += String.fromCharCode(byte)),
      "",
    );
    setBin(bin);
  }, [data.buff]);

  return (
    <Dialog
      trigger={(dialog) => (
        <Button onClick={dialog.open} classNames={{ button: "inline" }}>
          <BinaryCode />
        </Button>
      )}
      className="w-full max-w-4xl bg-transparent"
      content={(dialog) => (
        <React.Fragment>
          <Button
            classNames={{ button: "ml-auto" }}
            color="ghost"
            onClick={dialog.close}
          >
            <ArrowShrink />
          </Button>
          <p className="whitespace-pre-wrap bg-black text-white">{bin}</p>
        </React.Fragment>
      )}
    />
  );
}
