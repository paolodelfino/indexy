"use client";
import Button from "@/components/Button";
import FormText from "@/components/form/FormText";
import { ArrowDown01 } from "@/components/icons";
import { FormField } from "@/utils/form2";
import React, { useActionState, useEffect } from "react";
import { z } from "zod";

// TODO: Think of custom styling

type Item = {
  content: string;
  id: string;
};

type Meta = {
  selectedItems: Item[];
  showSearch: boolean;
  searchResult: Item[];
  searchQueryMeta: string;
  searchQueryValue: string;
  searchQueryError: string | undefined;
};

type Value<AcceptIndeterminate extends boolean> =
  AcceptIndeterminate extends true ? string[] | undefined : string[];

export type FieldSelectSearch<AcceptIndeterminate extends boolean> = FormField<
  Value<AcceptIndeterminate>,
  Meta
>;

function validate(meta: Meta, searchQueryValue: Meta["searchQueryValue"]) {
  const schema = z.string().trim().min(1);
  const error = schema.safeParse(searchQueryValue).error?.flatten()
    .formErrors[0];

  let newMeta = { ...meta }; // TODO: Is this necessary? (maybe react compiler)

  newMeta.searchQueryError = error;
  if (error === undefined) newMeta.searchQueryValue = searchQueryValue;

  return newMeta;
}

export default function FormSelectSearch({
  meta,
  setMeta,
  setValue,
  error,
  disabled,
  acceptIndeterminate,
  title,
  search,
  blacklist, // TODO: Exclude from search database query
}: (
  | {
      acceptIndeterminate: true;
      setValue: (value: Value<true>) => void;
    }
  | {
      acceptIndeterminate?: false;
      setValue: (value: Value<false>) => void;
    }
) & {
  meta: Meta;
  setMeta: (meta: Meta) => void;
  error: string | undefined;
  disabled: boolean;
  title: string; // TODO: Make React.ReactNode
  blacklist?: string[];
  search: (prevState: unknown, payload: { query: string }) => Promise<Item[]>;
}) {
  useEffect(() => {
    if (acceptIndeterminate)
      setValue(
        meta.selectedItems.length > 0
          ? meta.selectedItems.map((it) => it.id)
          : undefined,
      );
    else setValue(meta.selectedItems.map((it) => it.id));
  }, [meta.selectedItems]);

  const [searchResult, searchAction, isSearching] = useActionState(
    search,
    void 0,
  );

  useEffect(() => {
    if (searchResult !== undefined)
      setMeta({
        ...meta,
        searchResult,
      } satisfies Meta);
  }, [searchResult]);

  return (
    <div className="flex flex-col">
      <Title meta={meta} setMeta={setMeta} data={title} disabled={disabled} />

      <Error data={error} />

      <SelectedList meta={meta} setMeta={setMeta} disabled={disabled} />

      {meta.showSearch && (
        <React.Fragment>
          <SearchBar
            isSearching={isSearching}
            search={searchAction}
            meta={meta}
            setMeta={setMeta}
            disabled={disabled}
          />

          <SearchResult
            isSearching={isSearching}
            meta={meta}
            setMeta={setMeta}
            blacklist={blacklist}
            disabled={disabled}
          />
        </React.Fragment>
      )}
    </div>
  );
}

function Title({
  meta,
  setMeta,
  data,
  disabled,
}: {
  meta: Meta;
  setMeta: (meta: Meta) => void;
  data: string;
  disabled: boolean;
}) {
  return (
    <div className="group flex w-full items-center">
      <h2
        data-disabled={disabled}
        className="py-1 pl-4 text-lg font-medium leading-10 data-[disabled=true]:opacity-50"
      >
        {data}
      </h2>
      <Button
        aria-label="Toggle search"
        disabled={disabled}
        color="ghost"
        onClick={() =>
          setMeta({
            ...meta,
            showSearch: !meta.showSearch,
          })
        }
        classNames={{
          button: "group-hover:opacity-100 opacity-0 transition-opacity",
        }}
      >
        <ArrowDown01
          style={{
            transform: `rotate(${meta.showSearch ? 0 : 270}deg)`,
          }}
        />
      </Button>
    </div>
  );
}

function Error({ data }: { data: string | undefined }) {
  if (data !== undefined) return <span className="italic">{data}</span>;
}

function SelectedList({
  meta,
  setMeta,
  disabled,
}: {
  meta: Meta;
  setMeta: (meta: Meta) => void;
  disabled: boolean;
}) {
  if (meta.selectedItems.length > 0)
    return (
      <div className="flex flex-wrap gap-1">
        {meta.selectedItems.map((it) => (
          <SelectedItem
            key={it.id}
            data={it}
            meta={meta}
            setMeta={setMeta}
            disabled={disabled}
          />
        ))}
      </div>
    );
}

function SelectedItem({
  meta,
  setMeta,
  data,
  disabled,
}: {
  meta: Meta;
  setMeta: (meta: Meta) => void;
  data: Item;
  disabled: boolean;
}) {
  return (
    <Button
      title={data.content}
      disabled={disabled}
      onClick={() =>
        setMeta({
          ...meta,
          selectedItems: meta.selectedItems.filter((it) => it.id !== data.id),
        })
      }
      classNames={{ button: "max-w-32" }}
    >
      {data.content}
    </Button>
  );
}

function SearchBar({
  meta,
  setMeta,
  isSearching,
  search,
  disabled,
}: {
  meta: Meta;
  setMeta: (meta: Meta) => void;
  isSearching: boolean;
  disabled: boolean;
  search: (payload: { query: string }) => void;
}) {
  return (
    <FormText
      meta={meta.searchQueryMeta}
      setMeta={(searchQueryMeta) => setMeta({ ...meta, searchQueryMeta })}
      setValue={(searchQueryValue) => {
        setMeta(validate(meta, searchQueryValue!));
      }}
      className={'mt-5 data-[is-result="true"]:!rounded-b-none'}
      data-is-result={
        meta.searchResult.length > 0 &&
        !isSearching &&
        meta.searchQueryError === undefined
      }
      error={meta.searchQueryError}
      disabled={isSearching || disabled}
      onKeyDown={(e) => {
        if (e.code === "Enter" && meta.searchQueryError === undefined)
          search({ query: meta.searchQueryValue });
      }}
    />
  );
}

function SearchResult({
  meta,
  setMeta,
  blacklist,
  isSearching,
  disabled,
}: {
  meta: Meta;
  setMeta: (meta: Meta) => void;
  blacklist?: string[];
  isSearching: boolean;
  disabled: boolean;
}) {
  if (isSearching) return <span className="">loading</span>;

  if (meta.searchResult.length <= 0) return <span className="">empty</span>;

  return (
    <ul className="flex w-full flex-col">
      {meta.searchResult.map((it) => (
        <SearchResultItem
          key={it.id}
          data={it}
          meta={meta}
          setMeta={setMeta}
          blacklist={blacklist}
          disabled={disabled}
        />
      ))}
    </ul>
  );
}

function SearchResultItem({
  meta,
  setMeta,
  data,
  disabled,
  blacklist,
}: {
  meta: Meta;
  setMeta: (meta: Meta) => void;
  data: Item;
  disabled: boolean;
  blacklist?: string[];
}) {
  return (
    <Button
      role="listitem"
      size="large"
      full
      multiple
      disabled={
        meta.selectedItems.findIndex((it) => it.id === data.id) !== -1 ||
        (blacklist !== undefined &&
          blacklist.findIndex((itemId) => data.id === itemId) !== -1) ||
        disabled
      }
      onClick={() =>
        setMeta({
          ...meta,
          selectedItems: [...meta.selectedItems, data],
        })
      }
    >
      {data.content}
    </Button>
  );
}
