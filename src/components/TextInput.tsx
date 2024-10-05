"use client";
import { useValidationError } from "@/hooks/useValidationError";
import { FormFieldProps } from "@/utils/form";
import React from "react";
import TextArea from "react-textarea-autosize";
import { tv } from "tailwind-variants";

const textInput = tv({
  base: "w-full hyphens-auto break-words rounded bg-neutral-700 p-4",
  variants: {
    multiple: {
      true: "-mb-[7px]",
    },
  },
});

export function TextInput({
  value,
  setValue,
  validation,
  formPushError,
  formPopError,
  disabled,
  multiple,
  className,
}: FormFieldProps<string> & { multiple?: boolean; className?: string }) {
  const style = textInput({ multiple, className });

  const error = useValidationError(
    value,
    validation,
    formPushError,
    formPopError,
  );

  return (
    <React.Fragment>
      {multiple && (
        <TextArea
          className={style}
          disabled={disabled}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      )}
      {!multiple && (
        <input
          className={style}
          type="text"
          disabled={disabled}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
        />
      )}
      {error && <span>{error}</span>}
    </React.Fragment>
  );
}
