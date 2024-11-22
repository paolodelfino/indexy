"use client";

import Button from "@/components/Button";
import { cn } from "@/utils/cn";
import { startTransition, useEffect, useState } from "react";
import TextArea from "react-textarea-autosize";

//  import Example from "@/app/test/Example"

export default function Page() {
  const [text, setText] = useState("");
  const [n, setN] = useState(3);
  const [uploads, setUploads] = useState([
    {
      id: "some_id_0",
      content: "content 0",
      index: 0,
      unused: true,
    },
    {
      id: "some_id_1",
      content: "content 1",
      index: 1,
      unused: true,
    },
    {
      id: "some_id_2",
      content: "content 2",
      index: 2,
      unused: true,
    },
  ]);

  useEffect(() => {
    startTransition(() => {
      function isNumber(ch: number) {
        return ch >= "0".charCodeAt(0) && ch <= "9".charCodeAt(0);
      }

      let ups = uploads.map((it) => ({ ...it, unused: true }));

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
              if (ups[j].index === n) ups[j].unused = false;
            }
          }
          i = j - 1;
        }
      }

      setUploads(ups);
      // console.log(b);
    });
  }, [text]);

  return (
    <div>
      <div className="flex justify-end gap-2">
        <Button
          onClick={() => {
            const unused = uploads.filter((it) => it.unused);
            if (unused.length > 0) alert(`${unused.length} unused assets`);
          }}
        >
          save
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <Button
          onClick={() => {
            setUploads((uploads) => [
              ...uploads,
              {
                content: `content ${n}`,
                // index: uploads.length, TODO: Implement this
                index: n,
                id: `some_id_${n}`,
                unused: true,
              },
            ]);
            setN((n) => n + 1);
          }}
        >
          upload
        </Button>
        <div className="flex gap-2">
          {uploads.map((up) => {
            return (
              <button
                className={cn("shrink-0", up.unused && "opacity-50")}
                onClick={() =>
                  setUploads((ups) => ups.filter((it) => it.id !== up.id))
                }
                key={up.id}
              >
                {up.content}
              </button>
            );
          })}
        </div>
      </div>
      <TextArea
        className="w-full hyphens-auto break-words rounded bg-neutral-700 p-4 disabled:opacity-50"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          // console.log(
          //   "e.shiftKey",
          //   e.shiftKey,
          //   "e.altKey",
          //   e.altKey,
          //   "e.code",
          //   e.code,
          //   "e.ctrlKey",
          //   e.ctrlKey,
          //   "e.key",
          //   e.key,
          //   "e.location",
          //   e.location,
          //   "e.metaKey",
          //   e.metaKey,
          // );
        }}
      />
    </div>
  );
  // return notFound();
  //  return <Example/>
}
