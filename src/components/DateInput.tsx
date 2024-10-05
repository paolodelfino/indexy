"use client";
import { useValidationError } from "@/hooks/useValidationError";
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
}: FormFieldProps<string> & { className?: string }) {
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
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={disabled}
      />
      {error && <span>{error}</span>}
    </React.Fragment>
  );
}
