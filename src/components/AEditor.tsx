"use client";

import ActionFetch__ResourceBuffer from "@/actions/ActionFetch__ResourceBuffer";
import Button from "@/components/Button";
import FieldTextArea, {
  FieldTextArea__Type,
} from "@/components/form_ui/FieldTextArea";
import {
  GoBackward5Sec,
  GoForward5Sec,
  InformationCircle,
  Menu11,
  Pause,
  Play,
} from "@/components/icons";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/popover";
import clientEnv from "@/utils/clientEnv";
import { cn } from "@/utils/cn";
import { FormField } from "@/utils/form";
import {
  resource__ExtractFromFile,
  resource__GetReferences,
  resource__SetUnused,
} from "@/utils/resource__client";
import { Selectable } from "kysely";
import { Resource } from "kysely-codegen/dist/db";
import { useEffect, useId, useMemo, useRef, useState } from "react";

type Item = Pick<Selectable<Resource>, "n" | "sha256" | "type"> & {
  buff?: ArrayBuffer;
  blobUrl?: string;
  unused: boolean;
};

type Meta = {
  items: Item[];
  n: number;
  inspiration_id: string | undefined;
};

type Value =
  | (Pick<Selectable<Resource>, "n" | "sha256" | "type"> & {
      buff?: ArrayBuffer;
    })[]
  | undefined;

export type FieldAEditor__Type = FormField<Value, Meta>;

export function fieldAEditor(meta?: Partial<Meta>): FieldAEditor__Type {
  return {
    meta: {
      items: [],
      n: 0,
      inspiration_id: undefined,
      ...meta,
    },
    value: undefined,
    default: {
      meta: {
        items: [],
        n: 0,
        inspiration_id: undefined,
        ...meta,
      },
      value: undefined,
    },
    error: undefined,
  };
}

// TODO: Magari ordina per n per la memoria visiva
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
        // TODO: Is the revoke being handled? Has it to?
        // TODO: Maybe store the blob url (you can probably manually revoke it when necessary)
        if (it.type === "image")
          return (
            <ImageView
              key={`${it.type}/${it.sha256}`}
              data={it}
              meta={meta}
              setMeta={setMeta}
              disabled={disabled}
            />
          );
        else if (it.type === "video")
          return (
            <VideoView
              key={`${it.type}/${it.sha256}`}
              data={it}
              meta={meta}
              setMeta={setMeta}
              disabled={disabled}
            />
          );
        else if (it.type === "audio")
          return (
            <AudioView
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
      {/* NOTE: At the moment, I don't see necessary the virtualization */}
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

        <UploadButton
          meta={meta}
          setMeta={setMeta}
          meta__FieldTextArea={meta__FieldTextArea}
          disabled={disabled}
        />

        {itemsView}
      </div>

      <FieldTextArea
        meta={meta__FieldTextArea}
        setMeta={setMeta__FieldTextArea}
        setValue={(value) => {
          setValue__FieldTextArea(value);

          clearTimeout(timeout.current);
          timeout.current = setTimeout(
            () => resource__SetUnused(value!, meta, setMeta),
            250,
          );
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
    <div className="mt-auto">
      <input
        type="file"
        disabled={disabled}
        hidden
        multiple
        onChange={async (e) => {
          if (e.target.files !== null) {
            // console.log("e.target.files", e.target.files);
            // TODO: Maybe use startTransition

            const added = (
              await Promise.all(
                Array.from(e.target.files).map(async (it) => {
                  const res = await resource__ExtractFromFile(meta, it);
                  if (res === undefined)
                    alert(`${it.name} is an already uploaded resource`);
                  return res;
                }),
              )
            ).filter((it) => it !== undefined);

            if (added.length > 0) {
              let n = meta.n;

              // TODO: Magari dovremmo usare il valore anche qui, oppure sempre il meta
              const references = resource__GetReferences(meta__FieldTextArea);

              const newUploads = added.map((it) => {
                const itN = it.n ?? ++n;

                const isUnused =
                  references.findIndex((ref) => itN === ref.n) === -1;

                return {
                  ...it,
                  n: itN,
                  unused: isUnused,
                };
              });

              setMeta({
                items: [...meta.items, ...newUploads],
                n: n,
              });
            }

            e.target.value = "";
          }
        }}
        id={id}
      />
      <label
        className="m-px flex w-min gap-2 whitespace-nowrap rounded-xl bg-neutral-800 px-2 py-1 text-start ring-1 ring-neutral-600 hover:cursor-pointer hover:bg-neutral-600 hover:ring-0 active:!bg-neutral-700 active:!ring-1 data-[disabled=true]:pointer-events-none data-[disabled=true]:text-neutral-500"
        htmlFor={id}
        data-disabled={disabled}
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
    <div
      className={cn(
        "group relative block h-40 w-auto shrink-0",
        data.unused && "opacity-50",
        disabled && "pointer-events-none opacity-50",
      )}
    >
      <img
        alt=""
        src={
          data.blobUrl ??
          `https://${clientEnv.MINIO_ADDRESS}/${data.type}/${data.sha256}`
        }
        className="h-40 w-auto"
      />

      <Popover placement="bottom-end">
        <PopoverTrigger
          disabled={disabled}
          classNames={{
            button:
              "absolute top-1 right-1 rounded-full group-hover:opacity-100 opacity-0",
          }}
          color="ghost"
        >
          <Menu11 />
        </PopoverTrigger>

        <PopoverContent>
          <Button
            disabled={disabled}
            color="danger"
            full
            size="large"
            onClick={() =>
              setMeta({
                items: meta.items.filter((it) => it.n !== data.n),
              })
            }
          >
            Remove
          </Button>
        </PopoverContent>
      </Popover>

      <p className="absolute bottom-1 right-1 rounded-full bg-black/40 px-2">
        {data.n}
      </p>
    </div>
  );
}

function VideoView({
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
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleBackward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime -= 5;
    }
  };

  const handleForward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime += 5;
    }
  };

  return (
    <div
      className={cn(
        "group relative block h-40 w-auto shrink-0",
        data.unused && "opacity-50",
        disabled && "pointer-events-none opacity-50",
      )}
    >
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video className="h-40" ref={videoRef}>
        {/* TODO: I guess, Webkit, ass. It doesn't work  */}
        <source
          src={
            data.blobUrl ??
            `https://${clientEnv.MINIO_ADDRESS}/${data.type}/${data.sha256}`
          }
        />
      </video>

      <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2">
        <Button color="ghost" size="large" onClick={handleBackward}>
          <GoBackward5Sec />
        </Button>
        <Button color="ghost" size="large" onClick={handlePlayPause}>
          {isPlaying ? <Pause /> : <Play />}
        </Button>
        <Button color="ghost" size="large" onClick={handleForward}>
          <GoForward5Sec />
        </Button>
      </div>

      <Popover placement="bottom-end">
        <PopoverTrigger
          disabled={disabled}
          classNames={{
            button:
              "absolute top-1 right-1 rounded-full group-hover:opacity-100 opacity-0",
          }}
          color="ghost"
        >
          <Menu11 />
        </PopoverTrigger>

        <PopoverContent>
          <Button
            disabled={disabled}
            color="danger"
            full
            size="large"
            onClick={() =>
              setMeta({
                items: meta.items.filter((it) => it.n !== data.n),
              })
            }
          >
            Remove
          </Button>
        </PopoverContent>
      </Popover>

      <p className="absolute bottom-1 right-1 rounded-full bg-black/40 px-2">
        {data.n}
      </p>
    </div>
  );
}

function AudioView({
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
  const audioRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play();
        setIsPlaying(true);
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime -= 5;
    }
  };

  const handleForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime += 5;
    }
  };

  return (
    <div
      className={cn(
        "group relative flex h-40 w-auto shrink-0 items-center",
        data.unused && "opacity-50",
        disabled && "pointer-events-none opacity-50",
      )}
    >
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio ref={audioRef}>
        <source
          src={
            data.blobUrl ??
            `https://${clientEnv.MINIO_ADDRESS}/${data.type}/${data.sha256}`
          }
        />
      </audio>

      <div className="flex">
        <Button color="ghost" size="large" onClick={handleBackward}>
          <GoBackward5Sec />
        </Button>
        <Button color="ghost" size="large" onClick={handlePlayPause}>
          {isPlaying ? <Pause /> : <Play />}
        </Button>
        <Button color="ghost" size="large" onClick={handleForward}>
          <GoForward5Sec />
        </Button>
      </div>

      <Popover placement="bottom-end">
        <PopoverTrigger
          disabled={disabled}
          classNames={{
            button:
              "absolute top-1 right-1 rounded-full group-hover:opacity-100 opacity-0",
          }}
          color="ghost"
        >
          <Menu11 />
        </PopoverTrigger>

        <PopoverContent>
          <Button
            disabled={disabled}
            color="danger"
            full
            size="large"
            onClick={() =>
              setMeta({
                items: meta.items.filter((it) => it.n !== data.n),
              })
            }
          >
            Remove
          </Button>
        </PopoverContent>
      </Popover>

      <p className="absolute bottom-1 right-1 rounded-full bg-black/40 px-2">
        {data.n}
      </p>
    </div>
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
  const [text, setText] = useState<string | undefined>();

  useEffect(() => {
    if (data.buff !== undefined) {
      // TODO: I already tested it, but for some reason now I'm unsure. The thing is that the ui block is due to the large text and not the computation process and that startTransition is useless in this case (extra info: buffer.toString() takes time if not cut off)
      const buffer = Buffer.from(data.buff!);
      let text = buffer.toString("utf-8", 0, 1024);
      if (buffer.byteLength > 1024) text += "\r\n--- BIG FILE CUT OFF ---";
      setText(text);
    } else
      ActionFetch__ResourceBuffer({
        sha256: data.sha256,
        type: data.type,
      }).then((data) => {
        // console.log(data);
        setText(data);
      });
  }, [data.buff]);

  return (
    <div
      className={cn(
        "group relative block aspect-video h-40 w-auto shrink-0 overflow-y-auto bg-neutral-700",
        data.unused && "opacity-50",
        disabled && "pointer-events-none opacity-50",
      )}
    >
      <p className="hyphens-auto whitespace-pre-wrap break-words p-4">
        {text === undefined && "loading..."}
        {text !== undefined && text}
      </p>

      <Popover placement="bottom-end">
        <PopoverTrigger
          disabled={disabled}
          classNames={{
            button:
              "absolute top-1 right-1 rounded-full group-hover:opacity-100 opacity-0",
          }}
          color="ghost"
        >
          <Menu11 />
        </PopoverTrigger>
        <PopoverContent>
          <Button
            disabled={disabled}
            color="danger"
            full
            size="large"
            onClick={() =>
              setMeta({
                items: meta.items.filter((it) => it.n !== data.n),
              })
            }
          >
            Remove
          </Button>
        </PopoverContent>
      </Popover>

      <p className="absolute bottom-1 right-1 w-fit rounded-full bg-black/40 px-2">
        {data.n}
      </p>
    </div>
  );
}
