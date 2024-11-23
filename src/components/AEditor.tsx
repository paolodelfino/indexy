"use client";

import Button from "@/components/Button";
import FieldTextArea, {
  FieldTextArea__Type,
} from "@/components/form_ui/FieldTextArea";
import { BinaryCode, InformationCircle } from "@/components/icons";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/popover";
import { cn } from "@/utils/cn";
import { FormField } from "@/utils/form";
import { Selectable } from "kysely";
import { DB } from "kysely-codegen/dist/db";
import Image from "next/image";
import { startTransition, useEffect, useId } from "react";

type Meta = {
  items: {
    sha256: string;
    type: Selectable<DB["resource"]>["type"];
    n: number;
    buff: ArrayBuffer;
    unused: boolean;
  }[];
  n: number;
};

type Value =
  | {
      sha256: string;
      type: Selectable<DB["resource"]>["type"];
      buff: ArrayBuffer;
    }[]
  | undefined;

export type FieldAEditor__Type = FormField<Value, Meta>;

export function fieldAEditor(meta?: Partial<Meta>): FieldAEditor__Type {
  return {
    meta: {
      items: [],
      n: 0,
      ...meta,
    },
    value: undefined,
    default: {
      meta: {
        items: [],
        n: 0,
        ...meta,
      },
      value: undefined,
    },
    error: undefined,
  };
}

// TODO: Fai il check dell'unused anche quando uploadi qualcosa di nuovo

export default function AEditor({
  meta,
  setMeta,
  setValue,
  error,
  meta__FieldTextArea,
  setMeta__FieldTextArea,
  setValue__FieldTextArea,
  error__FieldTextArea,
  disabled,
}: {
  meta: Meta;
  setMeta: (meta: Partial<Meta>) => void;
  setValue: (value: Value) => void;
  error: string | undefined;
  meta__FieldTextArea: FieldTextArea__Type["meta"];
  setMeta__FieldTextArea: (
    ...args: Parameters<Parameters<typeof FieldTextArea>["0"]["setMeta"]>
  ) => void;
  setValue__FieldTextArea: (
    ...args: Parameters<Parameters<typeof FieldTextArea>["0"]["setValue"]>
  ) => void;
  error__FieldTextArea: string | undefined;
  disabled: boolean;
}) {
  useEffect(() => {
    console.log(
      "value",
      meta.items.map(
        (it) =>
          ({
            sha256: it.sha256,
            type: it.type,
            buff: it.buff,
          }) satisfies NonNullable<Value>[number],
      ),
    );

    setValue(
      meta.items.map(
        (it) =>
          ({
            sha256: it.sha256,
            type: it.type,
            buff: it.buff,
          }) satisfies NonNullable<Value>[number],
      ),
    );

    console.log("meta.items", meta.items);
  }, [meta.items]);

  const id = useId();

  return (
    <div className="space-y-2">
      <div className="flex items-end gap-2 overflow-x-auto">
        {error !== undefined && (
          <Popover>
            <PopoverTrigger color="danger">
              <InformationCircle />
            </PopoverTrigger>
            <PopoverContent className="rounded border bg-neutral-700 p-4 italic">
              {error}
            </PopoverContent>
          </Popover>
        )}

        <div>
          <input
            type="file"
            disabled={disabled}
            hidden
            multiple
            onChange={async (e) => {
              if (e.target.files !== null) {
                console.log("e.target.files", e.target.files);
                // TODO: Maybe use startTransition
                // TODO: Check for pre-existing resource (client and server)
                let n = meta.n;
                setMeta({
                  items: [
                    ...meta.items,
                    ...(
                      await Promise.all(
                        Array.from(e.target.files).map(async (it) => {
                          const sha256 = Array.from(
                            new Uint8Array(
                              await crypto.subtle.digest(
                                { name: "SHA-256" },
                                await it.arrayBuffer(),
                              ),
                            ),
                          )
                            .map((byte) => byte.toString(16).padStart(2, "0"))
                            .join("");

                          const image = new Set([
                            "jpg",
                            "jpeg",
                            "png",
                            "gif",
                            "bmp",
                            "svg",
                            "webp",
                            "ico",
                            "tif",
                            "tiff",
                          ]);

                          const ext = it.name.split(".").pop()?.toLowerCase(); // TODO: Try with magic number

                          const type: Selectable<DB["resource"]>["type"] =
                            ext === undefined
                              ? "binary"
                              : image.has(ext)
                                ? "image"
                                : "binary";

                          // TODO: Also do server-side check
                          // TODO: Check più sicuri, perché, ad esempio, potrei essere connesso da più dispositivi
                          if (
                            meta.items.find(
                              (it) => it.sha256 === sha256 && it.type === type,
                            )
                          ) {
                            alert(`${it.name} is an already uploaded resource`);
                            return undefined;
                          }

                          return {
                            buff: await it.arrayBuffer(), // TODO: What's more performant?
                            sha256,
                            type: type,
                            n: ++n,
                            unused: true,
                          };
                        }),
                      )
                    ).filter((it) => it !== undefined),
                  ],
                  n: n,
                });
                e.target.value = "";
              }
            }}
            id={id}
          />
          <label
            className="m-px flex w-min gap-2 whitespace-nowrap rounded-xl bg-neutral-800 px-2 py-1 text-start ring-1 ring-neutral-600 hover:cursor-pointer hover:bg-neutral-600 hover:ring-0 active:!bg-neutral-700 active:!ring-1 data-[disabled=true]:pointer-events-none data-[disabled=true]:text-neutral-500"
            htmlFor={id}
          >
            Upload
          </label>
        </div>

        <div className="flex items-end gap-2">
          {meta.items.map((it) => {
            if (it.type === "image") {
              // TODO: Is the revoke being handled? Has it to?
              // TODO: Maybe store the blob url (you can probably manually revoke it when necessary)
              return (
                <Button
                  disabled={disabled}
                  classNames={{
                    button: cn(
                      "relative h-40 w-auto shrink-0 block p-0 overflow-hidden",
                      it.unused && "opacity-50",
                    ),
                  }}
                  key={`${it.type}/${it.sha256}`}
                  onClick={() =>
                    setMeta({
                      items: meta.items.filter((it2) => it2.n !== it.n),
                    })
                  }
                >
                  <Image
                    width={160}
                    height={160}
                    src={URL.createObjectURL(new Blob([it.buff]))}
                    alt={""}
                    className="h-full w-full"
                  />
                  <p className="absolute bottom-1 right-1 rounded-full bg-black/40 px-2">
                    {it.n}
                  </p>
                </Button>
              );
            } else {
              // TODO: Implement binary visualization
              return (
                <Button
                  disabled={disabled}
                  classNames={{
                    button: cn(
                      "relative h-20 w-20 shrink-0 block p-0 overflow-hidden",
                      it.unused && "opacity-50",
                    ),
                    text: "flex justify-center",
                  }}
                  key={`${it.type}/${it.sha256}`}
                  onClick={() =>
                    setMeta({
                      items: meta.items.filter((it2) => it2.n !== it.n),
                    })
                  }
                >
                  <BinaryCode className="h-10 w-10" />
                  <p className="absolute bottom-1 right-1 rounded-full bg-black/40 px-2">
                    {it.n}
                  </p>
                </Button>
              );
            }
          })}
        </div>
      </div>

      <FieldTextArea
        meta={meta__FieldTextArea}
        setMeta={setMeta__FieldTextArea}
        setValue={(value) => {
          setValue__FieldTextArea(value);

          startTransition(() => {
            function isNumber(ch: number) {
              return ch >= "0".charCodeAt(0) && ch <= "9".charCodeAt(0);
            }

            const uploads = meta.items;

            let ups = uploads.map((it) => ({ ...it, unused: true }));

            const text = value!;

            // let b = "";
            for (let i = 0; i < text.length; ++i) {
              // b += text[i];
              if (text[i] === "$") {
                let j: number;
                for (j = i + 1; j < text.length; ++j) {
                  if (!isNumber(text.charCodeAt(j))) break;
                }
                const n = parseInt(text.slice(i + 1, j));
                if (!Number.isNaN(n)) {
                  // console.log(j, i, n);
                  // ups[n] !== undefined && (ups[n].unused = false); TODO: Implement
                  for (let j = 0; j < ups.length; ++j) {
                    if (ups[j].n === n) ups[j].unused = false;
                  }
                }
                i = j - 1;
              }
            }

            setMeta({ items: ups });
            // console.log(b);
          });
        }}
        error={error__FieldTextArea}
        disabled={disabled}
      />
    </div>
  );
}
