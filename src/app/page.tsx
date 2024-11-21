"use client";

import Button from "@/components/Button";
import UIQuery from "@/components/db_ui/UIQuery";
import FieldText from "@/components/form_ui/FieldText";
import { Cloud, InformationCircle, SearchSquare } from "@/components/icons";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/popover";
import useInfiniteQuery from "@/hooks/useInfiniteQuery";
import useFormSearch__Query from "@/stores/forms/useFormSearch__Query";
import useQueryQueries__Search from "@/stores/queries/useQueryQueries__Search";
import useQueryQueries__View from "@/stores/queries/useQueryQueries__View";
import { useEffect, useState } from "react";
import { VList } from "virtua";

export default function Page() {
  const query = useQueryQueries__View();
  // TODO: Maybe form.isDirty instead of form.meta.showSearch
  const form = useFormSearch__Query();
  const searchQuery = useQueryQueries__Search();

  const [isFormPending, setIsFormPending] = useState(false);

  const idView = useInfiniteQuery({
    callback: query.fetch,
    fetchIfNoData: true,
    nextOffset: query.nextOffset,
    active: query.active,
    inactive: query.inactive,
    data: query.data,
    getId(item) {
      return item.values;
    },
  });

  const idSearch = useInfiniteQuery({
    callback: () => searchQuery.fetch(searchQuery.lastArgs![0]),
    fetchIfNoData: false,
    nextOffset: searchQuery.nextOffset,
    active: searchQuery.active,
    inactive: searchQuery.inactive,
    data: searchQuery.data,
    getId(item) {
      return item.values;
    },
  });

  useEffect(() => {
    form.setOnSubmit(async (form) => {
      form.setFormMeta({ showSearch: true });

      setIsFormPending(true);

      searchQuery.reset();
      searchQuery.active();
      searchQuery.fetch(form.values());

      setIsFormPending(false);
    });
  }, [form.setOnSubmit]);

  if (query.data === undefined) return <p>loading no cache</p>;

  if (query.data.length <= 0) return <p>empty</p>;

  return (
    <div className="flex h-full flex-col space-y-6">
      <div className="flex items-center gap-2">
        <FieldText
          disabled={isFormPending}
          error={form.fields.name.error}
          meta={form.fields.name.meta}
          setMeta={form.setMeta.bind(null, "name")}
          setValue={form.setValue.bind(null, "name")}
          classNames={{ container: "w-full", input: "rounded-t-none" }}
        />
        {form.error !== undefined && (
          <Popover>
            <PopoverTrigger color="danger">
              <InformationCircle />
            </PopoverTrigger>
            <PopoverContent className="rounded border bg-neutral-700 p-4 italic">
              {form.error}
            </PopoverContent>
          </Popover>
        )}
        <Button
          title="Clear"
          disabled={isFormPending}
          color="ghost"
          onClick={() => {
            form.reset();
            form.setFormMeta({ showSearch: false });
          }}
        >
          <Cloud />
        </Button>
        <Button
          title="Search"
          disabled={isFormPending}
          onClick={form.submit}
          size="large"
          color="ghost"
        >
          <SearchSquare />
        </Button>
      </div>

      {form.meta.showSearch && searchQuery.data === undefined && (
        <p>loading no cache</p>
      )}
      {form.meta.showSearch &&
        searchQuery.data !== undefined &&
        searchQuery.data.length <= 0 && <p>empty</p>}
      {/* TODO: Use searchQuery.total */}
      {form.meta.showSearch &&
        searchQuery.data !== undefined &&
        searchQuery.data.length > 0 && (
          <VList
            // ssrCount={}
            keepMounted={[
              searchQuery.data.length - 1,
              searchQuery.data.length - 1 + 1,
            ]}
            className="pb-16 scrollbar-hidden"
            id={idSearch}
          >
            {searchQuery.data.map((it) => {
              return (
                <UIQuery
                  key={it.values}
                  data={it}
                  id={`${idSearch}_${it.values}`}
                />
              );
            })}
            {searchQuery.isFetching ? <p>loading next</p> : ""}
          </VList>
        )}

      {!form.meta.showSearch && (
        <VList
          // ssrCount={}
          keepMounted={[query.data.length - 1, query.data.length - 1 + 1]}
          className="pb-16 scrollbar-hidden"
        >
          {query.data.map((it) => {
            return (
              <UIQuery
                key={it.values}
                data={it}
                id={`${idView}_${it.values}`}
              />
            );
          })}
          {query.isFetching ? <p>loading next</p> : ""}
        </VList>
      )}
    </div>
  );
}
