"use client";
import { Star } from "@/components/icons";
import { useValidationError } from "@/hooks/useValidationError";
import { FormFieldProps } from "@/utils/form";
import React from "react";
import { tv } from "tailwind-variants";

const checkboxInput = tv({
  slots: {
    button: "text-neutral-300",
    icon: "",
  },
  variants: { checked: { true: { icon: "fill-current" } } },
});

type ClassNames = {
  [key in keyof ReturnType<typeof checkboxInput>]?: string;
};

export function CheckboxInput({
  value,
  setValue,
  validation,
  formPushError,
  formPopError,
  disabled,
  classNames,
}: FormFieldProps<boolean> & { classNames?: ClassNames }) {
  const style = checkboxInput({ checked: value });

  const error = useValidationError(
    value,
    validation,
    formPushError,
    formPopError,
  );

  return (
    <React.Fragment>
      <button
        type="button"
        aria-label="Toggle checkbox"
        className={style.button({ className: classNames?.button })}
        onClick={() => setValue(!value)}
        disabled={disabled}
      >
        <Star className={style.icon({ className: classNames?.icon })} />
      </button>
      {error && <span>{error}</span>}
    </React.Fragment>
  );
}
