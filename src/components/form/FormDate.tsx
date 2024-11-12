"use client";
import Button, { styles as buttonStyles } from "@/components/Button";
import { dateToIsoString } from "@/utils/date";
import { FormField } from "@/utils/form2";
import { SlotsToClasses } from "@/utils/tailwind-variants";
import { useEffect } from "react";
import { tv } from "tailwind-variants";

export const styles = tv({
  extend: buttonStyles,
  slots: {
    dateInput:
      "bg-black text-neutral-500 [&::-webkit-calendar-picker-indicator]:-ml-6 disabled:opacity-50",
  },
});

type Meta<AcceptIndeterminate extends boolean> =
  AcceptIndeterminate extends true ? Date | undefined : Date;

type Value<AcceptIndeterminate extends boolean> =
  AcceptIndeterminate extends true ? Date | undefined : Date;

export type FieldDate<AcceptIndeterminate extends boolean> = FormField<
  Value<AcceptIndeterminate>,
  Meta<AcceptIndeterminate>
>;

export default function FormDate({
  meta,
  setMeta,
  setValue,
  error,
  disabled,
  classNames,
  acceptIndeterminate,
}: (
  | {
      acceptIndeterminate: true;
      setValue: (value: Value<true>) => void;
      meta: Meta<true>;
      setMeta: (meta: Meta<true>) => void;
    }
  | {
      acceptIndeterminate?: false;
      setValue: (value: Value<false>) => void;
      meta: Meta<false>;
      setMeta: (meta: Meta<false>) => void;
    }
) & {
  error: string | undefined;
  disabled: boolean;
  classNames?: SlotsToClasses<keyof ReturnType<typeof styles>>;
}) {
  const style = styles();

  useEffect(() => {
    setValue(meta as any);
  }, [meta]);

  return (
    <div className="flex">
      <input
        className={style.dateInput({ className: classNames?.dateInput })}
        type="datetime-local"
        step="1"
        value={meta === undefined ? "" : dateToIsoString(meta)}
        onChange={(e) => setMeta(new Date(e.target.value))}
        disabled={disabled}
      />

      {acceptIndeterminate && (
        <Button
          disabled={disabled}
          color="ghost"
          classNames={{
            button: style.button({ className: classNames?.button }),
            iconContainer: style.iconContainer({
              className: classNames?.iconContainer,
            }),
            text: style.text({ className: classNames?.text }),
          }}
          onClick={() => setMeta(undefined)}
        >
          Clear
        </Button>
      )}

      {error !== undefined && <span className="italic">{error}</span>}
    </div>
  );
}
