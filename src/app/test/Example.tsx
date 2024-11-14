"use client";

import Button, { ButtonLink } from "@/components/Button";
import { createInfiniteQuery } from "@/utils/query";
import { useEffect } from "react";
import ReactJson from "react-json-view";

const db = Array.from({ length: 50 }, () =>
  Math.random().toString(36).substring(2, 10),
);

export const useTestQuery = createInfiniteQuery(3, async (offset, limit) => {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return db.slice(offset, offset + limit);
});

export default function Example() {
  const q = useTestQuery();

  useEffect(() => {
    if (!q.isActive) q.active();
    if (q.data === undefined) q.fetch();

    return () => q.inactive();
  }, []);

  if (q.data === undefined) return <span>no cache</span>;

  return (
    <div>
      {!q.isFetching && (
        <ReactJson src={q.data} name={false} theme={"monokai"} />
      )}
      <Button disabled={q.isFetching} onClick={q.fetch}>
        {q.isFetching ? "fetching" : "fetch"}
      </Button>
      <Button
        onClick={() => {
          q.reset();
          q.active();
          q.fetch();
        }}
      >
        reset
      </Button>
      <InvalidateExample />
      <DataExample />
      <ButtonLink href={"/test2"}>goto page2</ButtonLink>
    </div>
  );
}

function InvalidateExample() {
  const invalidate = useTestQuery((state) => state.invalidate);

  return <Button onClick={invalidate}>invalidate</Button>;
}

function DataExample() {
  const data = useTestQuery((state) => state.data!);

  return <ReactJson src={data} name={false} theme={"monokai"} />;
}
