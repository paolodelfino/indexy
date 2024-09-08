"use client";
import Inspiration from "@/components/inspiration/Inspiration";
import { useState } from "react";

export default function InspirationView({
  data,
}: {
  data: { id: string; content: string; date: Date; highlight: boolean }[];
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
              <Inspiration
                key={it.id}
                data={it}
                mode={mode}
                setMode={setMode}
              />
            );
          })}
        </ul>
      )}
    </>
  );
}
