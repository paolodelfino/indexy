"use client";
import { searchBigPaintAction } from "@/actions/searchBigPaintAction";
import { searchBigPaintsAction } from "@/actions/searchBigPaintsAction";
import BigPaintView from "@/components/big_paint/TempBigPaintView";
import { DateInput } from "@/components/DateInput";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/popover";
import { SearchSelect } from "@/components/SearchSelect";
import { TextInput } from "@/components/TextInput";
import { useValidationError } from "@/hooks/useValidationError";
import { searchBigPaintFormSchema } from "@/schemas/searchBigPaintFormSchema";
import { useSearchBigPaintForm } from "@/stores/useSearchBigPaintForm";
import { FormFieldProps, FormValues } from "@/utils/form";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { z } from "zod";

// TODO: Possibilità di andare avanti e indietro
export default function SearchBigPaintForm() {
  const form = useSearchBigPaintForm();

  const [fetchedAtLeastOnce, setFetchedAtLeastOnce] = useState(false);

  const {
    isError,
    error: queryError,
    data: queryData,
    isFetching: isSearchPending,
    refetch: fetch,
  } = useQuery({
    queryKey: ["big_paints", "search"],
    queryFn: ({ meta }) =>
      searchBigPaintAction(
        meta!.payload as FormValues<typeof searchBigPaintFormSchema>,
      ),
    enabled: !form.isInvalid && fetchedAtLeastOnce,
    meta: { payload: form.values() },
  });

  useEffect(() => {
    if (!fetchedAtLeastOnce && queryData !== undefined)
      setFetchedAtLeastOnce(true);
  }, [queryData]);

  if (isError) throw queryError;

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (!form.isInvalid) fetch();
        }}
        className="space-y-6"
      >
        <div className="flex flex-wrap items-center justify-end gap-2 px-1 py-px">
          <OrderBy
            value={form.orderBy}
            setValue={(value) => {
              form.set({ orderBy: value });
            }}
            validation={searchBigPaintFormSchema.sourceType().shape.orderBy}
            disabled={isSearchPending}
            formPopError={form.popError}
            formPushError={form.pushError}
          />
          <OrderByDir
            value={form.orderByDir}
            setValue={(value) => {
              form.set({ orderByDir: value });
            }}
            validation={searchBigPaintFormSchema.sourceType().shape.orderByDir}
            disabled={isSearchPending}
            formPopError={form.popError}
            formPushError={form.pushError}
          />
          <button
            type="submit"
            className="max-w-32 overflow-hidden text-ellipsis whitespace-nowrap rounded bg-blue-500 px-3 ring-1 ring-blue-300 hover:bg-blue-300 hover:ring-0 active:bg-blue-400 active:ring-1"
            disabled={isSearchPending || form.isInvalid}
          >
            {isSearchPending ? "Searching..." : "Search"}
          </button>
        </div>
        <TextInput
          value={form.name}
          setValue={(value) => {
            form.set({
              name: (value?.length || 0) > 0 ? value : undefined,
            });
          }}
          validation={searchBigPaintFormSchema.sourceType().shape.name}
          formPushError={form.pushError}
          formPopError={form.popError}
          disabled={isSearchPending}
          placeholder="Name"
        />
        <Date_
          value={form.date}
          setValue={(value) => {
            form.set({
              date: value,
            });
          }}
          validation={searchBigPaintFormSchema.sourceType().shape.date}
          formPushError={form.pushError}
          formPopError={form.popError}
          disabled={isSearchPending}
        />
        <SearchSelect
          formPushError={form.pushError}
          formPopError={form.popError}
          value={form.related_big_paints_ids}
          defaultValue={[]}
          setValue={(value) => {
            const newValue = (value?.length || 0) > 0 ? value : undefined;
            if (newValue !== form.related_big_paints_ids)
              form.set({
                related_big_paints_ids: newValue,
              });
          }}
          validation={
            searchBigPaintFormSchema.sourceType().shape.related_big_paints_ids
          }
          searchAction={searchBigPaintsAction}
          title="Related BigPaints"
          selectId={(value) => value.id}
          selectContent={(value) => value.name}
          disabled={isSearchPending}
        />
      </form>
      {queryData?.data && (
        <div>
          <h2 className="p-4 text-lg font-medium">
            Result ({queryData.data.length})
          </h2>
          <BigPaintView data={queryData.data} />
        </div>
      )}
    </>
  );
}

function OrderBy({
  disabled,
  formPopError,
  formPushError,
  setValue,
  validation,
  value,
}: FormFieldProps<"date" | "name">) {
  const error = useValidationError(
    value,
    validation,
    formPushError,
    formPopError,
  );

  return (
    <React.Fragment>
      <Popover placement="bottom-start">
        <PopoverTrigger
          disabled={disabled}
          className="hyphens-auto break-words rounded bg-neutral-800 p-2 px-2 text-start ring-1 ring-neutral-600 disabled:text-neutral-500 [&:not(:disabled):active]:!bg-neutral-700 [&:not(:disabled):active]:!ring-1 [&:not(:disabled):hover]:bg-neutral-600 [&:not(:disabled):hover]:ring-0"
        >{`Order by (${value})`}</PopoverTrigger>
        <PopoverContent
          className="z-20 flex min-w-16 max-w-[160px] flex-col"
          role="list"
        >
          <button
            disabled={disabled}
            role="listitem"
            className="flex gap-2 bg-neutral-800 p-3 ring-1 ring-neutral-600 hover:bg-neutral-600 hover:ring-0 active:bg-neutral-700 active:ring-1"
            onClick={() => setValue("date")}
          >
            date
          </button>
          <button
            disabled={disabled}
            role="listitem"
            className="flex gap-2 bg-neutral-800 p-3 ring-1 ring-neutral-600 hover:bg-neutral-600 hover:ring-0 active:bg-neutral-700 active:ring-1"
            onClick={() => setValue("name")}
          >
            name
          </button>
        </PopoverContent>
      </Popover>
      {error && <span>{error}</span>}
    </React.Fragment>
  );
}

function OrderByDir({
  disabled,
  formPopError,
  formPushError,
  setValue,
  validation,
  value,
}: FormFieldProps<"desc" | "asc">) {
  const error = useValidationError(
    value,
    validation,
    formPushError,
    formPopError,
  );

  return (
    <React.Fragment>
      <Popover placement="bottom-start">
        <PopoverTrigger
          disabled={disabled}
          className="hyphens-auto break-words rounded bg-neutral-800 p-2 px-2 text-start ring-1 ring-neutral-600 disabled:text-neutral-500 [&:not(:disabled):active]:!bg-neutral-700 [&:not(:disabled):active]:!ring-1 [&:not(:disabled):hover]:bg-neutral-600 [&:not(:disabled):hover]:ring-0"
        >{`Order by dir (${value})`}</PopoverTrigger>
        <PopoverContent
          className="z-20 flex min-w-16 max-w-[160px] flex-col"
          role="list"
        >
          <button
            disabled={disabled}
            role="listitem"
            className="flex gap-2 overflow-hidden text-ellipsis hyphens-auto whitespace-nowrap break-words bg-neutral-800 p-3 text-start ring-1 ring-neutral-600 disabled:text-neutral-500 [&:not(:disabled):active]:!bg-neutral-700 [&:not(:disabled):active]:!ring-1 [&:not(:disabled):hover]:bg-neutral-600 [&:not(:disabled):hover]:ring-0"
            onClick={() => setValue("asc")}
          >
            asc
          </button>
          <button
            disabled={disabled}
            role="listitem"
            className="flex gap-2 bg-neutral-800 p-3 ring-1 ring-neutral-600 hover:bg-neutral-600 hover:ring-0 active:bg-neutral-700 active:ring-1"
            onClick={() => setValue("desc")}
          >
            desc
          </button>
        </PopoverContent>
      </Popover>
      {error && <span>{error}</span>}
    </React.Fragment>
  );
}

function Date_({
  value,
  disabled,
  formPopError,
  formPushError,
  setValue,
  validation,
}: FormFieldProps<FormValues<typeof searchBigPaintFormSchema>["date"]>) {
  const error = useValidationError(
    value,
    validation,
    formPushError,
    formPopError,
  );

  const [comparison, setComparison] =
    useState<
      NonNullable<
        FormValues<typeof searchBigPaintFormSchema>["date"]
      >["comparison"]
    >();

  const [x1, setX1] = useState<Date | undefined>();

  const [x2, setX2] = useState<Date>(new Date());

  useEffect(() => {
    if (comparison !== undefined && x1 !== undefined)
      setValue({ comparison, x1, x2 });
    else if (value !== undefined) setValue(undefined);
  }, [comparison, x1, x2]);

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-lg font-medium">Date</h2>
      <Popover placement="bottom-start">
        <PopoverTrigger
          disabled={disabled}
          className="w-fit hyphens-auto break-words rounded bg-neutral-800 p-2 px-2 text-start ring-1 ring-neutral-600 disabled:text-neutral-500 [&:not(:disabled):active]:!bg-neutral-700 [&:not(:disabled):active]:!ring-1 [&:not(:disabled):hover]:bg-neutral-600 [&:not(:disabled):hover]:ring-0"
        >{`Comparison (${comparison})`}</PopoverTrigger>
        <PopoverContent
          className="z-20 flex min-w-16 max-w-[160px] flex-col"
          role="list"
        >
          <button
            disabled={disabled}
            role="listitem"
            className="flex gap-2 overflow-hidden text-ellipsis hyphens-auto whitespace-nowrap break-words bg-neutral-800 p-3 text-start ring-1 ring-neutral-600 disabled:text-neutral-500 [&:not(:disabled):active]:!bg-neutral-700 [&:not(:disabled):active]:!ring-1 [&:not(:disabled):hover]:bg-neutral-600 [&:not(:disabled):hover]:ring-0"
            onClick={() => setComparison(undefined)}
          >
            undefined
          </button>
          <button
            disabled={disabled}
            role="listitem"
            className="flex gap-2 overflow-hidden text-ellipsis hyphens-auto whitespace-nowrap break-words bg-neutral-800 p-3 text-start ring-1 ring-neutral-600 disabled:text-neutral-500 [&:not(:disabled):active]:!bg-neutral-700 [&:not(:disabled):active]:!ring-1 [&:not(:disabled):hover]:bg-neutral-600 [&:not(:disabled):hover]:ring-0"
            onClick={() => setComparison(">")}
          >
            {">"}
          </button>
          <button
            disabled={disabled}
            role="listitem"
            className="flex gap-2 overflow-hidden text-ellipsis hyphens-auto whitespace-nowrap break-words bg-neutral-800 p-3 text-start ring-1 ring-neutral-600 disabled:text-neutral-500 [&:not(:disabled):active]:!bg-neutral-700 [&:not(:disabled):active]:!ring-1 [&:not(:disabled):hover]:bg-neutral-600 [&:not(:disabled):hover]:ring-0"
            onClick={() => setComparison("<")}
          >
            {"<"}
          </button>
          <button
            disabled={disabled}
            role="listitem"
            className="flex gap-2 overflow-hidden text-ellipsis hyphens-auto whitespace-nowrap break-words bg-neutral-800 p-3 text-start ring-1 ring-neutral-600 disabled:text-neutral-500 [&:not(:disabled):active]:!bg-neutral-700 [&:not(:disabled):active]:!ring-1 [&:not(:disabled):hover]:bg-neutral-600 [&:not(:disabled):hover]:ring-0"
            onClick={() => setComparison("=")}
          >
            {"="}
          </button>
          <button
            disabled={disabled}
            role="listitem"
            className="flex gap-2 overflow-hidden text-ellipsis hyphens-auto whitespace-nowrap break-words bg-neutral-800 p-3 text-start ring-1 ring-neutral-600 disabled:text-neutral-500 [&:not(:disabled):active]:!bg-neutral-700 [&:not(:disabled):active]:!ring-1 [&:not(:disabled):hover]:bg-neutral-600 [&:not(:disabled):hover]:ring-0"
            onClick={() => setComparison(">=")}
          >
            {">="}
          </button>
          <button
            disabled={disabled}
            role="listitem"
            className="flex gap-2 overflow-hidden text-ellipsis hyphens-auto whitespace-nowrap break-words bg-neutral-800 p-3 text-start ring-1 ring-neutral-600 disabled:text-neutral-500 [&:not(:disabled):active]:!bg-neutral-700 [&:not(:disabled):active]:!ring-1 [&:not(:disabled):hover]:bg-neutral-600 [&:not(:disabled):hover]:ring-0"
            onClick={() => setComparison("<=")}
          >
            {"<="}
          </button>
          <button
            disabled={disabled}
            role="listitem"
            className="flex gap-2 overflow-hidden text-ellipsis hyphens-auto whitespace-nowrap break-words bg-neutral-800 p-3 text-start ring-1 ring-neutral-600 disabled:text-neutral-500 [&:not(:disabled):active]:!bg-neutral-700 [&:not(:disabled):active]:!ring-1 [&:not(:disabled):hover]:bg-neutral-600 [&:not(:disabled):hover]:ring-0"
            onClick={() => setComparison("between")}
          >
            {"between"}
          </button>
        </PopoverContent>
      </Popover>
      <DateInput
        acceptIndeterminate
        disabled={disabled}
        formPopError={formPopError}
        formPushError={formPushError}
        setValue={(value) => setX1(value)}
        validation={z.date().optional()}
        value={x1}
      />
      {comparison === "between" && (
        <DateInput
          disabled={disabled}
          formPopError={formPopError}
          formPushError={formPushError}
          setValue={(value) => setX2(value)}
          validation={z.date()}
          value={x2}
        />
      )}
      {error !== undefined && <span>{error}</span>}
    </div>
  );
}
