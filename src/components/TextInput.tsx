"use client";
import { useValidationError } from "@/hooks/useValidationError";
import { FormFieldProps } from "@/utils/form";
import { ReactNode } from "react";
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

// Simple rule for label and placeholder: if there is a label, no placeholder needed and use label if there will be times the placeholder won't be visible because there will already be content filling the space, but don't use label if it's a pretty known, deducible field by the user
export function TextInput({
  value,
  setValue,
  validation,
  formPushError,
  formPopError,
  disabled,
  multiple,
  className,
  placeholder,
  label: _label,
}: FormFieldProps<string | undefined> & {
  multiple?: boolean;
  className?: string;
  placeholder?: string;
  label?: ReactNode;
}) {
  const style = textInput({ multiple, className });

  const error = useValidationError(
    value,
    validation,
    formPushError,
    formPopError,
  );

  const label =
    typeof _label === "string" ? (
      <h3 className="pl-2 text-base leading-10">{_label}</h3>
    ) : (
      _label
    );

  return (
    <div>
      {label}

      {multiple && (
        <TextArea
          className={style}
          disabled={disabled}
          value={value || ""}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
        />
      )}
      {!multiple && (
        <input
          className={style}
          type="text"
          disabled={disabled}
          value={value || ""}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
          placeholder={placeholder}
        />
      )}

      {error && <span>{error}</span>}
    </div>
  );
}
