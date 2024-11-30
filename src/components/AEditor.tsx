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
import { Resource } from "kysely-codegen/dist/db";
import Image from "next/image";
import { useEffect, useId, useMemo, useRef } from "react";

type Item = Pick<Selectable<Resource>, "n" | "sha256" | "type"> & {
  buff: ArrayBuffer;
  blob_url: string;
  unused: boolean;
};

type Meta = {
  items: Item[];
  n: number;
};

type Value =
  | (Pick<Selectable<Resource>, "n" | "sha256" | "type"> & {
      buff: ArrayBuffer;
    })[]
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

// TODO: Magari ordina per n per la memoria visiva
// TODO: Dovremmo fare il check dell'unused anche al submit (sopratutto per il delay aggiunto al check relativo al text field). Magari dovremmo aggiungere la possibilità di mettere più listeners sul form.onSubmit e dare la possibilità ai field di iscriversi
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
  const timeout = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    setValue(
      meta.items.map(
        (it) =>
          ({
            sha256: it.sha256,
            type: it.type,
            buff: it.buff,
            n: it.n,
          }) satisfies NonNullable<Value>[number],
      ),
    );
  }, [meta.items]); // TODO: Con il client-side routing si bugga il setValue?

  // TODO: Vedere se il compiler fa questa ottimizazione. In caso contrario, è possibile che ci siano altre ottimizzazioni del genere da fare
  const itemsView = useMemo(
    () =>
      meta.items.map((it) => {
        if (it.type === "image")
          // TODO: Is the revoke being handled? Has it to?
          // TODO: Maybe store the blob url (you can probably manually revoke it when necessary)
          return (
            <ImageView
              key={`${it.type}/${it.sha256}`}
              data={it}
              meta={meta}
              setMeta={setMeta}
              disabled={disabled}
            />
          );
        else
          return (
            <BinaryView
              key={`${it.type}/${it.sha256}`}
              data={it}
              meta={meta}
              setMeta={setMeta}
              disabled={disabled}
            />
          );
      }),
    [meta, disabled], // TODO: Con il client-side routing si bugga il setMeta?
  );

  return (
    <div className="space-y-2">
      {/* TODO: Sticky doesn't work on iphone, I think because it scrolls the window */}
      <div className="sticky top-0 flex items-end gap-2 overflow-x-auto bg-black">
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

        <UploadButton
          meta={meta}
          setMeta={setMeta}
          meta__FieldTextArea={meta__FieldTextArea}
          disabled={disabled}
        />

        <div className="flex items-end gap-2">{itemsView}</div>
      </div>

      <FieldTextArea
        meta={meta__FieldTextArea}
        setMeta={setMeta__FieldTextArea}
        setValue={(value) => {
          setValue__FieldTextArea(value);

          clearTimeout(timeout.current);
          timeout.current = setTimeout(() => {
            const uploads = meta.items;

            let ups = uploads.map((it) => ({ ...it, unused: true }));

            const text = value!;

            // let b = "";
            for (let i = 0; i < text.length; ++i) {
              // b += text[i];
              if (text[i] === "$") {
                let j: number;
                for (
                  j = i + 1;
                  j < text.length && text[j] >= "0" && text[j] <= "9";
                  ++j
                ) {
                  // if (!isNumber(text.charCodeAt(j))) break;
                }
                const n = parseInt(text.slice(i + 1, j));
                if (!Number.isNaN(n)) {
                  // console.log(j, i, n);
                  for (let j = 0; j < ups.length; ++j) {
                    if (ups[j].n === n) {
                      ups[j].unused = false;
                      break;
                    }
                  }
                }
                i = j - 1;
              }
            }

            if (meta.items.some((it, i) => it.unused !== ups[i].unused))
              setMeta({ items: ups });
            // console.log(b);
          }, 250);
        }}
        error={error__FieldTextArea}
        disabled={disabled}
      />
    </div>
  );
}

function UploadButton({
  meta,
  setMeta,
  meta__FieldTextArea,
  disabled,
}: {
  meta: Meta;
  setMeta: (value: Partial<Meta>) => void;
  meta__FieldTextArea: FieldTextArea__Type["meta"];
  disabled: boolean;
}) {
  const id = useId();

  return (
    <div>
      <input
        type="file"
        disabled={disabled}
        hidden
        multiple
        onChange={async (e) => {
          if (e.target.files !== null) {
            // console.log("e.target.files", e.target.files);
            // TODO: Maybe use startTransition
            // TODO: Check for pre-existing resource (client and server)
            let n = meta.n;
            const newItems = [
              ...meta.items,
              ...(
                await Promise.all(
                  Array.from(e.target.files).map(async (it) => {
                    // console.log("it", it)

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

                    const type: Selectable<Resource>["type"] =
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
                      buff: await it.arrayBuffer(),
                      blob_url: URL.createObjectURL(it),
                      sha256,
                      type: type,
                      n: ++n,
                      unused: true,
                    } satisfies Item;
                  }),
                )
              ).filter((it) => it !== undefined),
            ];

            let ups = newItems.map((it) => ({ ...it, unused: true }));
            const text = meta__FieldTextArea; // TODO: Magari dovremmo usare il valore anche qui, oppure sempre il meta
            for (let i = 0; i < text.length; ++i) {
              if (text[i] === "$") {
                let j: number;
                for (
                  j = i + 1;
                  j < text.length && text[j] >= "0" && text[j] <= "9";
                  ++j
                ) {}
                const n = parseInt(text.slice(i + 1, j));
                if (!Number.isNaN(n)) {
                  for (let j = 0; j < ups.length; ++j) {
                    if (ups[j].n === n) {
                      ups[j].unused = false;
                      break;
                    }
                  }
                }
                i = j - 1;
              }
            }

            setMeta({
              items: ups,
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
  );
}

function ImageView({
  data,
  meta,
  setMeta,
  disabled,
}: {
  data: Item;
  meta: Meta;
  setMeta: (value: Partial<Meta>) => void;
  disabled: boolean;
}) {
  return (
    <Button
      disabled={disabled}
      classNames={{
        button: cn(
          "relative h-40 w-auto shrink-0 block p-0 overflow-hidden",
          data.unused && "opacity-50",
        ),
      }}
      key={`${data.type}/${data.sha256}`}
      onClick={() =>
        setMeta({
          items: meta.items.filter((it) => it.n !== data.n),
        })
      }
    >
      <Image
        width={160}
        height={160}
        src={data.blob_url}
        alt={""}
        className="h-full w-full"
      />
      <p className="absolute bottom-1 right-1 rounded-full bg-black/40 px-2">
        {data.n}
      </p>
    </Button>
  );
}

function BinaryView({
  data,
  meta,
  setMeta,
  disabled,
}: {
  data: Item;
  meta: Meta;
  setMeta: (value: Partial<Meta>) => void;
  disabled: boolean;
}) {
  return (
    <Button
      disabled={disabled}
      classNames={{
        button: cn(
          "relative h-20 w-20 shrink-0 block p-0 overflow-hidden",
          data.unused && "opacity-50",
        ),
        text: "flex justify-center",
      }}
      key={`${data.type}/${data.sha256}`}
      onClick={() =>
        setMeta({
          items: meta.items.filter((it) => it.n !== data.n),
        })
      }
    >
      <BinaryCode className="h-10 w-10" />
      <p className="absolute bottom-1 right-1 rounded-full bg-black/40 px-2">
        {data.n}
      </p>
    </Button>
  );
}
