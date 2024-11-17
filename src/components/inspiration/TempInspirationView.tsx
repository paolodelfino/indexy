"use client";
import Inspiration from "@/components/inspiration/Inspiration";

export default function InspirationView({
  data,
}: {
  data: { id: string; content: string; date: Date; highlight: boolean }[];
}) {
  if (data.length === 0) {
    return "empty";
  }

  return (
    <>
      {data.length > 0 && (
        <ul>
          {data.map((it, i) => {
            return <Inspiration key={it.id} data={it} />;
          })}
        </ul>
      )}
    </>
  );
}
