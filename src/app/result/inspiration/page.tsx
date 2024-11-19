"use client";

import Inspiration from "@/components/inspiration/Inspiration";
import useInfiniteQuery from "@/hooks/useInfiniteQuery";
import { searchInspirationFormSchema } from "@/schemas/searchInspirationFormSchema";
import useInspirationSearchQuery from "@/stores/useInspirationSearchQuery";
import { useSearchInspirationForm } from "@/stores/useSearchInspirationForm";
import { valuesFromSearchParams } from "@/utils/url";
import { useEffect, useMemo } from "react";
import { VList } from "virtua";

// TODO: Possible server side first items injection

export default function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const values = useMemo(
    () =>
      searchInspirationFormSchema.parse(
        // TODO: Possiamo probabilmente evitare di parsare con zod qui
        valuesFromSearchParams(searchParams),
      ),
    [searchParams],
  );

  const query = useInspirationSearchQuery();
  const form = useSearchInspirationForm();

  useEffect(() => {
    const values_str = JSON.stringify(searchParams);
    if (values_str !== form.meta.lastValues) {
      query.reset();
      query.active();

      form.setFormMeta({ lastValues: values_str });
    }
  }, [values]);

  const id = useInfiniteQuery({
    nextOffset: query.nextOffset,
    hasData: query.data !== undefined,
    lastId:
      query.data === undefined || query.data.length <= 0
        ? undefined
        : query.data[query.data.length - 1].id,
    // callback: () => query.fetch(query.lastArgs![0]),
    callback: () => query.fetch(values),
    fetchIfNoData: true,
    active: query.active,
    inactive: query.inactive,
  });

  if (query.data === undefined) return <span>loading no cache</span>;

  return (
    <div className="flex h-full flex-col">
      <h2 className="p-4 text-lg font-medium">Result ({query.total})</h2>
      <VList
        keepMounted={[query.data.length - 1, query.data.length - 1 + 1]}
        className="pb-16 scrollbar-hidden"
      >
        {query.data.map((it, i) => {
          return <Inspiration key={it.id} data={it} id={`${id}_${it.id}`} />;
        })}
        {query.isFetching ? "loading..." : ""}
      </VList>
    </div>
  );
}
