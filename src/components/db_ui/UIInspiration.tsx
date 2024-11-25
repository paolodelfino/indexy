"use client";

import Button, { ButtonLink } from "@/components/Button";
import { Dialog } from "@/components/Dialog";
import { ArrowShrink, PencilEdit01 } from "@/components/icons";
import { Selectable } from "kysely";
import { BigPaint, Inspiration, Resource } from "kysely-codegen/dist/db";
import React, { ReactNode, useEffect, useState } from "react";

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
  // TODO: Forse non si aggiornano dopo il primo edit e torni indietro. Si aggiorna dopo il secondo save edit
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

  return (
    <div id={id} className="">
      <div className="hyphens-auto whitespace-pre-wrap break-words border bg-neutral-700 p-4">
        {contentNodes}
      </div>
      <ButtonLink
        color="ghost"
        href={`/edit/${data.id}/inspiration`}
        classNames={{ button: "size-9 justify-center items-center" }}
      >
        <PencilEdit01 className="text-neutral-300" />
      </ButtonLink>
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
        <Button onClick={dialog.open} classNames={{ button: "inline" }}>
          hello
        </Button>
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
          <img src={`data:image/png;base64,${base64}`} />
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
          hello
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
