"use client";
import Inspiration from "@/components/inspiration/Inspiration";
import { useApp } from "@/stores/useApp";
import { useEffect } from "react";

export default function InspirationView({
  data,
}: {
  data: { id: string; content: string; date: Date; highlight: boolean }[];
}) {
  const setIsEmpty = useApp((state) => state.setIsEmpty);

  useEffect(() => {
    setIsEmpty(data.length === 0);

    return () => {
      setIsEmpty(true);
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
            return <Inspiration key={it.id} data={it} />;
          })}
        </ul>
      )}
    </>
  );
}
