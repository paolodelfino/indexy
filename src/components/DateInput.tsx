"use client";
import Button from "@/components/Button";
import { useValidationError } from "@/hooks/useValidationError";
import { ComponentProps } from "@/utils/tailwind-variants";
import { dateToIsoString } from "@/utils/date";
import { FormFieldProps } from "@/utils/form";
import { tv } from "tailwind-variants";

const dateInput = tv({
  slots: {
    dateInput:
      "bg-black text-neutral-500 [&::-webkit-calendar-picker-indicator]:-ml-6",
    clearButton: "",
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
    <div className="flex">
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
        <Button
          disabled={disabled}
          color="ghost"
          classNames={{
            button: style.clearButton({ className: classNames?.clearButton }),
          }}
          onClick={() => setValue(undefined)}
        >
          Clear
        </Button>
      )}
      {error && <span>{error}</span>}
    </div>
  );
}
