"use client";
import Button, { styles as buttonStyles } from "@/components/Button";
import { RemoveSquare, Square } from "@/components/icons";
import { FormField } from "@/utils/form2";
import React, { useEffect } from "react";
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

type Meta = boolean | undefined;

type Value = boolean | undefined;

export type FieldCheckbox = FormField<Value, Meta>;

export default function FormCheckbox({
  meta,
  setMeta,
  setValue,
  error,
  disabled,
  acceptIndeterminate = false,
  label,
  checkedIcon,
  uncheckedIcon,
  indeterminateIcon,
  classNames,
  color = "ghost",
  full = false,
  size = "default",
}: {
  meta: Meta;
  setMeta: (meta: Meta) => void;
  setValue: (value: Value) => void;
  error: string | undefined;
  disabled: boolean;
  label?: string; // TODO: ReactNode
  checkedIcon?: React.ReactNode;
  uncheckedIcon?: React.ReactNode;
  indeterminateIcon?: React.ReactNode;
  classNames?: {
    [key in keyof ReturnType<typeof styles>]?: ClassValue;
  };
  acceptIndeterminate?: boolean;
} & Omit<VariantProps<typeof styles>, "multiple" | "checked">) {
  useEffect(() => {
    setValue(meta);
  }, [meta]);

  const {
    button,
    iconContainer,
    icon: iconStyles,
    text,
  } = styles({
    color,
    size,
    full,
    checked: meta,
  });

  let onClick: VoidFunction, icon: React.ReactNode;

  if (acceptIndeterminate)
    onClick = () =>
      setMeta(meta === true ? false : meta === false ? undefined : true);
  else onClick = () => setMeta(!meta);

  if (meta === true)
    if (checkedIcon) icon = checkedIcon;
    else
      icon = <Square className={iconStyles({ className: classNames?.icon })} />;
  else if (meta === false)
    if (uncheckedIcon) icon = uncheckedIcon;
    else
      icon = <Square className={iconStyles({ className: classNames?.icon })} />;
  else if (meta === undefined)
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

      {error !== undefined && <span className="italic">{error}</span>}
    </React.Fragment>
  );
}
