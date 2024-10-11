"use client";
import { useValidationError } from "@/hooks/useValidationError";
import { ComponentProps } from "@/utils/component";
import { dateToIsoString } from "@/utils/date";
import { FormFieldProps } from "@/utils/form";
import { tv } from "tailwind-variants";

const dateInput = tv({
  slots: {
    dateInput:
      "bg-black text-neutral-500 [&::-webkit-calendar-picker-indicator]:-ml-6",
    clearButton:
      "hyphens-auto break-words rounded p-2 px-2 text-start disabled:text-neutral-500",
  },
});

type DateInputSlots = keyof ReturnType<typeof dateInput>;

export function DateInput({
  value,
  setValue,
  validation,
  formPushError,
  formPopError,
  disabled,
  classNames,
  acceptIndeterminate,
}: (
  | ({ acceptIndeterminate?: false } & FormFieldProps<Date>)
  | ({ acceptIndeterminate: true } & FormFieldProps<Date | undefined>)
) &
  ComponentProps<DateInputSlots>) {
  const style = dateInput();

  const error = useValidationError(
    value,
    validation,
    formPushError,
    formPopError,
  );

  return (
    <div>
      <input
        className={style.dateInput({ className: classNames?.dateInput })}
        type="datetime-local"
        step="1"
        value={value === undefined ? "" : dateToIsoString(value)}
        onChange={(e) => {
          const date = new Date(e.target.value);
          setValue(date);
        }}
        disabled={disabled}
      />
      {acceptIndeterminate && (
        <button
          type="button"
          disabled={disabled}
          className={style.clearButton({ className: classNames?.clearButton })}
          onClick={() => setValue(undefined)}
        >
          Clear
        </button>
      )}
      {error && <span>{error}</span>}
    </div>
  );
}
