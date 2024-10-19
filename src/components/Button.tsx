import Link, { LinkProps } from "next/link";
import { ClassValue, tv, VariantProps } from "tailwind-variants";

const styles = tv({
  slots: {
    button: "flex gap-2 text-start m-px w-min",
    icon: "flex-shrink-0",
    text: "overflow-hidden text-ellipsis hyphens-auto break-words",
  },
  variants: {
    color: {
      ghost: {
        button:
          "ring-neutral-600 disabled:text-neutral-500 [&:not(:disabled):active]:!bg-neutral-700 [&:not(:disabled):active]:!ring-1 [&:not(:disabled):hover]:bg-neutral-600 [&:not(:disabled):hover]:ring-0",
      },
      default: {
        button:
          "bg-neutral-800 ring-1 ring-neutral-600 disabled:text-neutral-500 [&:not(:disabled):active]:!bg-neutral-700 [&:not(:disabled):active]:!ring-1 [&:not(:disabled):hover]:bg-neutral-600 [&:not(:disabled):hover]:ring-0",
      },
      accent: {
        button:
          "bg-blue-500 ring-1 ring-blue-300 disabled:text-blue-200 [&:not(:disabled):active]:!bg-blue-300 [&:not(:disabled):active]:!ring-1 [&:not(:disabled):hover]:bg-blue-300 [&:not(:disabled):hover]:ring-0",
      },
      danger: {
        button:
          "bg-red-800 ring-1 ring-red-600 disabled:text-red-500 [&:not(:disabled):active]:!bg-red-700 [&:not(:disabled):active]:!ring-1 [&:not(:disabled):hover]:bg-red-600 [&:not(:disabled):hover]:ring-0",
      },
    },
    size: {
      default: { button: "rounded-xl py-1 px-2" },
      large: { button: "p-3" },
    },
    multiple: {
      true: { text: "" },
      false: { text: "whitespace-nowrap" },
    },
  },
  compoundVariants: [
    {
      size: "default",
      color: "ghost",
      className: "rounded-none",
    },
  ],
});

export default function Button({
  color = "default",
  size = "default",
  type = "button",
  multiple = false,
  icon,
  children,
  classNames,
  ...rest
}: {
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: never;
  classNames?: {
    [key in keyof ReturnType<typeof styles>]?: ClassValue;
  };
} & React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> &
  VariantProps<typeof styles>) {
  const { button, icon: iconStyles, text } = styles({ color, size, multiple });

  return (
    <button
      className={button({ className: classNames?.button })}
      type={type}
      {...rest}
    >
      {icon && (
        <div className={iconStyles({ className: classNames?.icon })}>
          {icon}
        </div>
      )}
      <span className={text({ className: classNames?.text })}>{children}</span>
    </button>
  );
}

export function ButtonLink({
  color = "default",
  size = "default",
  icon,
  children,
  classNames,
  ...rest
}: {
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: never;
  classNames?: {
    [key in keyof ReturnType<typeof styles>]?: ClassValue;
  };
} & React.DetailedHTMLProps<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
> &
  LinkProps &
  VariantProps<typeof styles>) {
  const { button, icon: iconStyles, text } = styles({ color, size });

  return (
    <Link className={button({ className: classNames?.button })} {...rest}>
      {icon && (
        <div className={iconStyles({ className: classNames?.icon })}>
          {icon}
        </div>
      )}
      <span className={text({ className: classNames?.text })}>{children}</span>
    </Link>
  );
}
