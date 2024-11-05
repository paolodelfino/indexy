"use client";
import { FormField } from "@/utils/form2";
import { ReactNode, useEffect } from "react";
import TextArea, { TextareaAutosizeProps } from "react-textarea-autosize";
import { tv } from "tailwind-variants";

const styles = tv({
  base: "w-full hyphens-auto break-words rounded bg-neutral-700 p-4 -mb-[7px] disabled:opacity-50",
});

type Meta = string;

type Value = string | undefined;

export type FieldTextArea = FormField<Value, Meta>;

/**
 * Simple rule for label and placeholder: if there is a label, no placeholder needed and use label if there will be times the placeholder won't be visible because there will already be content filling the space, but don't use label if it's a pretty known, deducible field by the user
 */
export default function FormTextArea({
  meta,
  setMeta,
  setValue,
  error,
  acceptIndeterminate = false,
  className,
  placeholder,
  label: _label,
  ...rest
}: {
  meta: Meta;
  setMeta: (meta: Meta) => void;
  setValue: (value: Value) => void;
  error: string | undefined;
  disabled: boolean;
  acceptIndeterminate?: boolean;
  className?: string;
  placeholder?: string;
  label?: ReactNode;
} & TextareaAutosizeProps) {
  const style = styles({ className });

  const label =
    typeof _label === "string" ? (
      <h3 className="pl-2 text-base leading-10">{_label}</h3>
    ) : (
      _label
    );

  useEffect(() => {
    setValue(
      acceptIndeterminate ? (meta.length <= 0 ? undefined : meta) : meta,
    );
  }, [meta]);

  return (
    <div>
      {label}

      <TextArea
        className={style}
        value={meta}
        onChange={(e) => setMeta(e.target.value)}
        placeholder={placeholder}
        {...rest}
      />

      {error !== undefined && <span className="italic">{error}</span>}
    </div>
  );
}
