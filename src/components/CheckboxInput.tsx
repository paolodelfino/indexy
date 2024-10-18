"use client";
import Button from "@/components/Button";
import { RemoveSquare, Square, Star } from "@/components/icons";
import { useValidationError } from "@/hooks/useValidationError";
import { FormFieldProps } from "@/utils/form";
import React from "react";
import { tv } from "tailwind-variants";

const checkboxInput = tv({
  slots: {
    button: "text-neutral-300",
    icon: "",
    label: "",
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
  acceptIndeterminate,
  label,
  id,
}: (
  | ({ acceptIndeterminate: false } & FormFieldProps<boolean>)
  | ({ acceptIndeterminate: true } & FormFieldProps<boolean | undefined>)
) &
  ({ label: string; id: string } | { label?: never; id?: never }) & {
    classNames?: ClassNames;
  }) {
  const style = checkboxInput({ checked: value });

  const error = useValidationError(
    value,
    validation,
    formPushError,
    formPopError,
  );

  if (acceptIndeterminate) {
    const _Button = (
      <Button
        id={id}
        aria-label="Change checkbox state"
        className={style.button({ className: classNames?.button })}
        onClick={() =>
          setValue(value === true ? false : value === false ? undefined : true)
        }
        disabled={disabled}
      >
        {value === true && <Square className="fill-current" />}
        {value === false && <Square />}
        {value === undefined && <RemoveSquare />}
      </Button>
    );

    return (
      <React.Fragment>
        {label && (
          <div className="flex flex-row items-center gap-2">
            {_Button}
            <label
              className={style.label({ className: classNames?.label })}
              htmlFor={id}
            >
              {label}
            </label>
          </div>
        )}
        {!label && _Button}
        {error && <span>{error}</span>}
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <Button
        aria-label="Toggle checkbox"
        color="ghost"
        className={style.button({ className: classNames?.button })}
        onClick={() => setValue(!value)}
        disabled={disabled}
      >
        <Star className={style.icon({ className: classNames?.icon })} />
      </Button>
      {error && <span>{error}</span>}
    </React.Fragment>
  );
}
