"use client";
import Button, { styles as buttonStyles } from "@/components/Button";
import { RemoveSquare, Square } from "@/components/icons";
import { FormField } from "@/utils/form";
import React, { useEffect } from "react";
import { ClassValue, tv, VariantProps } from "tailwind-variants";

export const styles = tv({
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

type Meta<AcceptIndeterminate extends boolean> =
  AcceptIndeterminate extends true ? boolean | undefined : boolean;

type Value<AcceptIndeterminate extends boolean> =
  AcceptIndeterminate extends true ? boolean | undefined : boolean;

export type FieldCheckbox<AcceptIndeterminate extends boolean> = FormField<
  Value<AcceptIndeterminate>,
  Meta<AcceptIndeterminate>
>;

export default function FormCheckbox({
  meta,
  setMeta,
  setValue,
  error,
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
  | {
      acceptIndeterminate: true;
      setValue: (value: Value<true>) => void;
      meta: Meta<true>;
      setMeta: (meta: Meta<true>) => void;
    }
  | {
      acceptIndeterminate?: false;
      setValue: (value: Value<false>) => void;
      meta: Meta<false>;
      setMeta: (meta: Meta<false>) => void;
    }
) & {
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
    setValue(meta as any);
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
