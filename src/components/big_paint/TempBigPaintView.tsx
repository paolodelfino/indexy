"use client";
import BigPaint from "@/components/big_paint/BigPaint";

export default function TempBigPaintView({
  data,
}: {
  data: { id: string; name: string; date: Date }[];
}) {
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
