"use client";
import BigPaint from "@/components/big_paint/BigPaint";
import { useState } from "react";

export default function TempBigPaintView({
  data,
}: {
  data: { id: string; name: string; date: Date }[];
}) {
  const [mode, setMode] = useState<"idle" | "edit">("idle");

  if (data.length === 0) {
    return "empty";
  }

  return (
    <>
      {data.length > 0 && (
        <ul>
          {data.map((it, i) => {
            return (
              <BigPaint key={it.id} data={it} mode={mode} setMode={setMode} />
            );
          })}
        </ul>
      )}
    </>
  );
}
