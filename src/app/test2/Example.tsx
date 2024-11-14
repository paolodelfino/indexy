"use client";

import { useTestQuery } from "@/app/test/Example";
import Button, { ButtonLink } from "@/components/Button";
import ReactJson from "react-json-view";

export default function Example() {
  const { data, isPending, fetch, invalidate } = useTestQuery((state) => ({
    data: state.data,
    isPending: state.isFetching,
    fetch: state.fetch,
    invalidate: state.invalidate,
  }));

  if (data === undefined) return "no cache";

  return (
    <div>
      {!isPending && <ReactJson name={false} theme="monokai" src={data} />}

      <Button disabled={isPending} onClick={fetch}>
        {isPending ? "fetching" : "fetch"}
      </Button>
      <Button onClick={invalidate}>invalidate</Button>
      <ButtonLink href="/test">goto page1</ButtonLink>
    </div>
  );
}
