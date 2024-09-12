"use client";
import BigPaint from "@/components/big_paint/BigPaint";
import { useApp } from "@/stores/useApp";
import { useEffect } from "react";

export default function TempBigPaintView({
  data,
}: {
  data: { id: string; name: string; date: Date }[];
}) {
  const makeEditAvailable = useApp((state) => state.makeEditAvailable);

  useEffect(() => {
    makeEditAvailable(data.length > 0);

    return () => {
      makeEditAvailable(false);
    };
  }, [data]);

  if (data.length === 0) {
    return "empty";
  }

  return (
    <>
      {data.length > 0 && (
        <ul>
          {data.map((it, i) => {
            return <BigPaint key={it.id} data={it} />;
          })}
        </ul>
      )}
    </>
  );
}
