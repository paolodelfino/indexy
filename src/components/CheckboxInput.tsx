"use client";
import Button, { styles as buttonStyles } from "@/components/Button";
import { RemoveSquare, Square } from "@/components/icons";
import { useValidationError } from "@/hooks/useValidationError";
import { FormFieldProps } from "@/utils/form";
import React from "react";
import { ClassValue, tv, VariantProps } from "tailwind-variants";

const styles = tv({
  extend: buttonStyles,
  slots: {
    icon: "",
  },
  variants: {
    checked: {
      true: { icon: "fill-current" },
      false: {},
    },
  },
});

export function CheckboxInput({
  value,
  setValue,
  validation,
  formPushError,
  formPopError,
  disabled,
  acceptIndeterminate,
  label,
  checkedIcon,
  uncheckedIcon,
  indeterminateIcon,
  classNames,
  color = "ghost",
  full = false,
  size = "default",
}: (
  | ({ acceptIndeterminate: false } & FormFieldProps<boolean>)
  | ({ acceptIndeterminate: true } & FormFieldProps<boolean | undefined>)
) & {
  label?: string; // TODO: ReactNode
  checkedIcon?: React.ReactNode;
  uncheckedIcon?: React.ReactNode;
  indeterminateIcon?: React.ReactNode;
  classNames?: {
    [key in keyof ReturnType<typeof styles>]?: ClassValue;
  };
} & Omit<VariantProps<typeof styles>, "multiple" | "checked">) {
  const {
    button,
    iconContainer,
    icon: iconStyles,
    text,
  } = styles({
    color,
    size,
    full,
    checked: value,
  });

  const error = useValidationError(
    value,
    validation,
    formPushError,
    formPopError,
  );

  let onClick: VoidFunction, icon: React.ReactNode;

  if (acceptIndeterminate)
    onClick = () =>
      setValue(value === true ? false : value === false ? undefined : true);
  else onClick = () => setValue(!value);

  if (value === true)
    if (checkedIcon) icon = checkedIcon;
    else
      icon = <Square className={iconStyles({ className: classNames?.icon })} />;
  else if (value === false)
    if (uncheckedIcon) icon = uncheckedIcon;
    else
      icon = <Square className={iconStyles({ className: classNames?.icon })} />;
  else if (value === undefined)
    if (indeterminateIcon) icon = indeterminateIcon;
    else
      icon = (
        <RemoveSquare className={iconStyles({ className: classNames?.icon })} />
      );

  return (
    <React.Fragment>
      <Button
        aria-label="Change checkbox state"
        color="ghost"
        classNames={{
          button: button({ className: classNames?.button }),
          iconContainer: iconContainer({
            className: classNames?.iconContainer,
          }),
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
