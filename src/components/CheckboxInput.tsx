"use client";
import Button from "@/components/Button";
import { RemoveSquare, Square, Star } from "@/components/icons";
import { useValidationError } from "@/hooks/useValidationError";
import { FormFieldProps } from "@/utils/form";
import React from "react";
import { tv } from "tailwind-variants";

const styles = tv({
  slots: {
    button: "text-neutral-300",
    icon: "",
    text: "",
  },
  variants: { checked: { true: { icon: "fill-current" } } },
});

type ClassNames = {
  [key in keyof ReturnType<typeof styles>]?: string;
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
  const { button, icon: iconStyles, text } = styles({ checked: value });

  const error = useValidationError(
    value,
    validation,
    formPushError,
    formPopError,
  );

  let onClick: VoidFunction, icon: React.ReactNode;
  // TODO: Man, I have to fix this icon bullscheisse below
  if (acceptIndeterminate) {
    onClick = () =>
      setValue(value === true ? false : value === false ? undefined : true);
    icon = (
      <React.Fragment>
        {value === true && <Square className="fill-current" />}
        {value === false && <Square />}
        {value === undefined && <RemoveSquare />}
      </React.Fragment>
    );
  } else {
    onClick = () => setValue(!value);
    icon = <Star className={iconStyles({ className: classNames?.icon })} />;
  }

  return (
    <React.Fragment>
      <Button
        aria-label="Change checkbox state"
        color="ghost"
        classNames={{
          button: button({ className: classNames?.button }),
          icon: iconStyles({ className: classNames?.icon }),
          text: text({ className: classNames?.text }),
        }}
        onClick={onClick}
        disabled={disabled}
        icon={label && icon}
      >
        {!label && icon}
        {label}
      </Button>
      {error && <span>{error}</span>}
    </React.Fragment>
  );
}
