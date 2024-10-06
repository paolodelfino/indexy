"use client";
import { useValidationError } from "@/hooks/useValidationError";
import { dateToIsoString } from "@/utils/date";
import { FormFieldProps } from "@/utils/form";
import React from "react";
import { tv } from "tailwind-variants";

const dateInput = tv({
  base: "bg-black text-neutral-500 [&::-webkit-calendar-picker-indicator]:-ml-6",
});

export function DateInput({
  value,
  setValue,
  validation,
  formPushError,
  formPopError,
  disabled,
  className,
}: FormFieldProps<Date> & { className?: string }) {
  const style = dateInput({ className });

  const error = useValidationError(
    value,
    validation,
    formPushError,
    formPopError,
  );

  return (
    <React.Fragment>
      <input
        className={style}
        type="datetime-local"
        step="1"
        value={dateToIsoString(value)}
        onChange={(e) => {
          const date = new Date(e.target.value);
          setValue(date);
        }}
        disabled={disabled}
      />
      {error && <span>{error}</span>}
    </React.Fragment>
  );
}
