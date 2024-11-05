"use client";
import { searchBigPaintAction } from "@/actions/searchBigPaintAction";
import { searchInspirationAction } from "@/actions/searchInspirationAction";
import Button from "@/components/Button";
import { CheckboxInput } from "@/components/CheckboxInput";
import { DateInput } from "@/components/DateInput";
import InspirationView from "@/components/inspiration/TempInspirationView";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/popover";
import { SearchSelect } from "@/components/SearchSelect";
import { TextInput } from "@/components/TextInput";
import { useValidationError } from "@/hooks/useValidationError";
import { searchInspirationFormSchema } from "@/schemas/searchInspirationFormSchema";
import { useSearchInspirationForm } from "@/stores/useSearchInspirationForm";
import { FormFieldProps, FormValues } from "@/utils/form";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { z } from "zod";

// TODO: Possibilità di andare avanti e indietro
export default function InspirationSearchForm() {
  const form = useSearchInspirationForm();

  const [fetchedAtLeastOnce, setFetchedAtLeastOnce] = useState(false);

  const {
    isError,
    error: queryError,
    data: queryData,
    isFetching: isSearchPending,
    refetch: fetch,
  } = useQuery({
    queryKey: ["inspirations", "search"],
    queryFn: ({ meta }) =>
      searchInspirationAction(
        meta!.payload as FormValues<typeof searchInspirationFormSchema>,
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
            setValue={(value) => form.set({ orderBy: value })}
            validation={searchInspirationFormSchema.sourceType().shape.orderBy}
            disabled={isSearchPending}
            formPopError={form.popError}
            formPushError={form.pushError}
          />
          <OrderByDir
            value={form.orderByDir}
            setValue={(value) => form.set({ orderByDir: value })}
            validation={
              searchInspirationFormSchema.sourceType().shape.orderByDir
            }
            disabled={isSearchPending}
            formPopError={form.popError}
            formPushError={form.pushError}
          />
          <Button
            type="submit"
            color="accent"
            disabled={isSearchPending || form.isInvalid}
          >
            {isSearchPending ? "Searching..." : "Search"}
          </Button>
        </div>
        <TextInput
          value={form.content}
          setValue={(value) =>
            form.set({
              content: (value?.length || 0) > 0 ? value : undefined,
            })
          }
          validation={searchInspirationFormSchema.sourceType().shape.content}
          formPushError={form.pushError}
          formPopError={form.popError}
          disabled={isSearchPending}
          placeholder="Content"
        />
        <Date_
          value={form.date}
          setValue={(value) =>
            form.set({
              date: value,
            })
          }
          validation={searchInspirationFormSchema.sourceType().shape.date}
          formPushError={form.pushError}
          formPopError={form.popError}
          disabled={isSearchPending}
        />
        <CheckboxInput
          value={form.highlight}
          acceptIndeterminate
          label="Highlight"
          setValue={(value) => form.set({ highlight: value })}
          validation={searchInspirationFormSchema.sourceType().shape.highlight}
          disabled={isSearchPending}
          formPopError={form.popError}
          formPushError={form.pushError}
          full
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
            searchInspirationFormSchema.sourceType().shape
              .related_big_paints_ids
          }
          searchAction={(prevState, { query }) =>
            searchBigPaintAction({
              name: query,
              orderBy: "date",
              orderByDir: "asc",
              date: undefined,
              related_big_paints_ids: undefined,
            }).then((res) =>
              res.data.map((item) => ({
                name: item.name,
                id: item.id,
              })),
            )
          }
          title="Related BigPaints"
          selectId={(value) => value.id}
          selectContent={(value) => value.name}
          disabled={isSearchPending}
        />
        <SearchSelect
          formPushError={form.pushError}
          formPopError={form.popError}
          value={form.related_inspirations_ids}
          defaultValue={[]}
          setValue={(value) => {
            const newValue = (value?.length || 0) > 0 ? value : undefined;
            if (newValue !== form.related_inspirations_ids)
              form.set({
                related_inspirations_ids: newValue,
              });
          }}
          validation={
            searchInspirationFormSchema.sourceType().shape
              .related_inspirations_ids
          }
          searchAction={(prevState, { query }) =>
            searchInspirationAction({
              content: query,
              orderBy: "date",
              orderByDir: "asc",
              date: undefined,
              highlight: undefined,
              related_big_paints_ids: undefined,
              related_inspirations_ids: undefined,
            }).then((res) =>
              res.data.map((item) => ({
                content: item.content,
                id: item.id,
              })),
            )
          }
          title="Related Inspirations"
          selectId={(value) => value.id}
          selectContent={(value) => value.content}
          disabled={isSearchPending}
        />
      </form>
      {queryData?.data && (
        <div>
          <h2 className="p-4 text-lg font-medium">
            Result ({queryData.data.length})
          </h2>
          <InspirationView data={queryData.data} />
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
}: FormFieldProps<"date" | "highlight" | "content">) {
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
        >{`Order by (${value})`}</PopoverTrigger>
        <PopoverContent
          className="z-20 flex min-w-16 max-w-[160px] flex-col"
          role="list"
        >
          <Button
            full
            disabled={disabled}
            role="listitem"
            size="large"
            onClick={() => setValue("date")}
          >
            date
          </Button>
          <Button
            full
            disabled={disabled}
            role="listitem"
            size="large"
            onClick={() => setValue("highlight")}
          >
            highlight
          </Button>
          <Button
            full
            disabled={disabled}
            role="listitem"
            size="large"
            onClick={() => setValue("content")}
          >
            content
          </Button>
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
        >{`Order by dir (${value})`}</PopoverTrigger>
        <PopoverContent
          className="z-20 flex min-w-16 max-w-[160px] flex-col"
          role="list"
        >
          <Button
            full
            disabled={disabled}
            role="listitem"
            size="large"
            onClick={() => setValue("asc")}
          >
            asc
          </Button>
          <Button
            full
            disabled={disabled}
            role="listitem"
            size="large"
            onClick={() => setValue("desc")}
          >
            desc
          </Button>
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
}: FormFieldProps<FormValues<typeof searchInspirationFormSchema>["date"]>) {
  const error = useValidationError(
    value,
    validation,
    formPushError,
    formPopError,
  );

  const [comparison, setComparison] =
    useState<
      NonNullable<
        FormValues<typeof searchInspirationFormSchema>["date"]
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
        >{`Comparison (${comparison})`}</PopoverTrigger>
        <PopoverContent
          className="z-20 flex min-w-16 max-w-[160px] flex-col"
          role="list"
        >
          <Button
            full
            disabled={disabled}
            role="listitem"
            size="large"
            onClick={() => setComparison(undefined)}
          >
            undefined
          </Button>
          <Button
            full
            disabled={disabled}
            role="listitem"
            size="large"
            onClick={() => setComparison(">")}
          >
            {">"}
          </Button>
          <Button
            full
            disabled={disabled}
            role="listitem"
            size="large"
            onClick={() => setComparison("<")}
          >
            {"<"}
          </Button>
          <Button
            full
            disabled={disabled}
            role="listitem"
            size="large"
            onClick={() => setComparison("=")}
          >
            {"="}
          </Button>
          <Button
            full
            disabled={disabled}
            role="listitem"
            size="large"
            onClick={() => setComparison(">=")}
          >
            {">="}
          </Button>
          <Button
            full
            disabled={disabled}
            role="listitem"
            size="large"
            onClick={() => setComparison("<=")}
          >
            {"<="}
          </Button>
          <Button
            full
            disabled={disabled}
            role="listitem"
            size="large"
            onClick={() => setComparison("between")}
          >
            {"between"}
          </Button>
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
