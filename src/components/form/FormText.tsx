"use client";
import { FormField } from "@/utils/form";
import { ReactNode, useEffect } from "react";
import { tv } from "tailwind-variants";

export const styles = tv({
  base: "w-full hyphens-auto break-words rounded bg-neutral-700 p-4 disabled:opacity-50",
  // TODO: Perché qui non c'è anche label?
});

type Meta = string;

type Value = string | undefined;

export type FieldText = FormField<Value, Meta>;

// We use undefined as the guard value assuming that undefined is equivalent to indeterminate state and nothing else for any field
export function fieldText(meta?: Meta): FieldText {
  return {
    meta: meta === undefined ? "" : meta,
    value: undefined,
    default: {
      meta: meta === undefined ? "" : meta,
      value: undefined,
    },
    error: undefined,
  };
}

/**
 * Simple rule for label and placeholder: if there is a label, no placeholder needed and use label if there will be times the placeholder won't be visible because there will already be content filling the space, but don't use label if it's a pretty known, deducible field by the user
 */
export default function FormText({
  meta,
  setMeta,
  setValue,
  error,
  acceptIndeterminate,
  className,
  placeholder,
  label: _label,
  ...rest
}: {
  acceptIndeterminate?: boolean;
  meta: Meta;
  setMeta: (meta: Meta) => void;
  setValue: (value: Value) => void;
  error: string | undefined;
  disabled: boolean;
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
      <h2
        aria-disabled={rest.disabled}
        className="py-1 pl-4 text-lg font-medium leading-10 data-[disabled=true]:opacity-50"
      >
        {_label}
      </h2>
    ) : (
      _label
    );

  useEffect(() => {
    setValue(acceptIndeterminate && meta.length <= 0 ? undefined : meta);
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
