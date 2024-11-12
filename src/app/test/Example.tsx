"use client";

import Button, { ButtonLink } from "@/components/Button";
import useTestQuery from "@/stores/useTestQuery";
import { useEffect } from "react";
import ReactJson from "react-json-view";

export default function Example() {
  const q = useTestQuery();

  useEffect(() => {
    if (!q.isActive) q.active();
    if (q.data === undefined) q.fetch({ foo: 0 });

    return () => q.inactive();
  }, []);

  if (q.data === undefined) return <span>no cache</span>;

  return (
    <div>
      {!q.isPending && (
        <ReactJson src={q.data} name={false} theme={"monokai"} />
      )}
      <Button disabled={q.isPending} onClick={q.fetch.bind(null, q.data)}>
        {q.isPending ? "fetching" : "fetch"}
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
