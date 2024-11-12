"use client";

import FormDate, { FieldDate } from "@/components/form/FormDate2";
import FormSelect, { FieldSelect } from "@/components/form/FormSelect";
import { datetime } from "@/utils/date";
import { FormField } from "@/utils/form2";
import { useEffect } from "react";

// TODO: Think of custom styling

type Value =
  | {
      comparison: ">" | "<" | "=" | ">=" | "<=";
      date: Date;
    }
  | {
      comparison: "between";
      date: Date;
      date2: Date;
    }
  | undefined;

type Meta = {
  comparison: FieldSelect<true>;
  date: FieldDate | undefined;
  date2: FieldDate | undefined;
};

export type FieldDateComparison = FormField<Value, Meta>;

export default function FormDateComparison({
  disabled,
  error,
  meta,
  setMeta,
  setValue,
  title,
  acceptIndeterminate,
}: {
  acceptIndeterminate?: boolean;
  setValue: (value: Value) => void;
  meta: Meta;
  setMeta: (meta: Meta) => void;
  error: string | undefined;
  disabled: boolean;
  title: string; // TODO: Make React.ReactNode
}) {
  useEffect(() => {
    const comparison = meta.comparison.value;

    if (comparison === undefined) {
      setMeta({
        ...meta,
        date: undefined,
        date2: undefined,
      });
    } else {
      setMeta({
        ...meta,
        date: {
          meta: {
            date: undefined,
            time: undefined,
          },
          value: undefined,
          default: {
            meta: {
              date: undefined,
              time: undefined,
            },
            value: undefined,
          },
          error: undefined,
        },
        date2:
          comparison === "between"
            ? {
                meta: {
                  date: undefined,
                  time: undefined,
                },
                value: undefined,
                default: {
                  meta: {
                    date: undefined,
                    time: undefined,
                  },
                  value: undefined,
                },
                error: undefined,
              }
            : undefined,
      });
    }
  }, [meta.comparison.value]);

  useEffect(() => {
    const comparison =
      meta.comparison.value === undefined
        ? undefined
        : (meta.comparison.value as NonNullable<Value>["comparison"]);

    const date =
      meta.date !== undefined &&
      meta.date.meta.date !== undefined &&
      meta.date.meta.time !== undefined
        ? datetime(meta.date.meta.date, meta.date.meta.time)
        : undefined!;

    const date2 =
      meta.date2 !== undefined &&
      meta.date2.meta.date !== undefined &&
      meta.date2.meta.time !== undefined
        ? datetime(meta.date2.meta.date, meta.date2.meta.time)
        : undefined!;

    setValue(
      acceptIndeterminate && comparison === undefined
        ? undefined
        : { comparison: comparison!, date, date2 },
    );
  }, [meta]);

  return (
    <div className="flex gap-2 overflow-x-auto">
      <FormSelect
        disabled={disabled}
        error={meta.comparison.error ?? error}
        meta={meta.comparison.meta}
        placeholder={title}
        setMeta={(value) =>
          setMeta({
            ...meta,
            comparison: {
              ...meta.comparison,
              meta: value,
            },
          })
        }
        // @ts-expect-error TODO: Remove
        setValue={(value) =>
          setMeta({
            ...meta,
            comparison: {
              ...meta.comparison,
              value,
            },
          })
        }
        acceptIndeterminate={acceptIndeterminate}
      />

      {meta.date !== undefined && (
        <FormDate
          placeholder="date"
          meta={meta.date.meta}
          setMeta={(value) =>
            setMeta({
              ...meta,
              // @ts-expect-error TODO: Remove
              date: {
                ...meta.date,
                meta: value,
              },
            })
          }
          setValue={(value) =>
            setMeta({
              ...meta,
              // @ts-expect-error TODO: Remove
              date: {
                ...meta.date,
                value,
              },
            })
          }
          error={meta.date.error}
          disabled={disabled}
        />
      )}

      {meta.date2 !== undefined && (
        <FormDate
          placeholder="date2"
          meta={meta.date2.meta}
          setMeta={(value) =>
            setMeta({
              ...meta,
              // @ts-expect-error TODO: Remove
              date2: {
                ...meta.date2,
                meta: value,
              },
            })
          }
          setValue={(value) =>
            setMeta({
              ...meta,
              // @ts-expect-error TODO: Remove
              date2: {
                ...meta.date2,
                value,
              },
            })
          }
          error={meta.date2.error}
          disabled={disabled}
        />
      )}
    </div>
  );
}
