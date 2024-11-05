"use client";
import { FormField } from "@/utils/form2";
import { ReactNode, useEffect } from "react";
import { tv } from "tailwind-variants";

const styles = tv({
  base: "w-full hyphens-auto break-words rounded bg-neutral-700 p-4 disabled:opacity-50",
});

type Meta = string;

type Value = string | undefined;

export type FieldTextInput = FormField<Value, Meta>;

/**
 * Simple rule for label and placeholder: if there is a label, no placeholder needed and use label if there will be times the placeholder won't be visible because there will already be content filling the space, but don't use label if it's a pretty known, deducible field by the user
 */
export default function FormTextInput({
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
} & React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>) {
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

      <input
        className={style}
        type="text"
        value={meta}
        onChange={(e) => setMeta(e.target.value)}
        placeholder={placeholder}
        {...rest}
      />

      {error !== undefined && <span className="italic">{error}</span>}
    </div>
  );
}
