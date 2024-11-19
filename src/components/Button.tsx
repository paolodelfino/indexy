import Link, { LinkProps } from "next/link";
import { ClassValue, tv, VariantProps } from "tailwind-variants";

// TODO: Problema con il line clamp
export const styles = tv({
  slots: {
    button: "flex gap-2 text-start m-px",
    iconContainer: "flex-shrink-0",
    text: "overflow-hidden text-ellipsis hyphens-auto break-words",
  },
  variants: {
    color: {
      ghost: {
        button:
          "ring-neutral-600 data-[disabled=true]:text-neutral-500 active:!bg-neutral-700 active:!ring-1 hover:bg-neutral-600 hover:ring-0 data-[disabled=true]:pointer-events-none",
      },
      default: {
        button:
          "bg-neutral-800 ring-1 ring-neutral-600 data-[disabled=true]:text-neutral-500 active:!bg-neutral-700 active:!ring-1 hover:bg-neutral-600 hover:ring-0 data-[disabled=true]:pointer-events-none",
      },
      accent: {
        button:
          "bg-blue-500 ring-1 ring-blue-300 data-[disabled=true]:text-blue-200 active:!bg-blue-300 active:!ring-1 hover:bg-blue-300 hover:ring-0 data-[disabled=true]:pointer-events-none",
      },
      danger: {
        button:
          "bg-red-800 ring-1 ring-red-600 data-[disabled=true]:text-red-500 active:!bg-red-700 active:!ring-1 hover:bg-red-600 hover:ring-0 data-[disabled=true]:pointer-events-none",
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
    full: {
      true: { button: "w-[calc(100%-1px)]" },
      false: { button: "w-min" },
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
  full = false,
  disabled,
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
  const { button, iconContainer, text } = styles({
    color,
    size,
    multiple,
    full,
  });

  return (
    <button
      className={button({ className: classNames?.button })}
      type={type}
      disabled={disabled}
      data-disabled={disabled === undefined ? false : disabled}
      {...rest}
    >
      {icon && (
        <div
          className={iconContainer({ className: classNames?.iconContainer })}
        >
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
  full = false,
  disabled,
  ...rest
}: {
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: never;
  classNames?: {
    [key in keyof ReturnType<typeof styles>]?: ClassValue;
  };
  disabled?: boolean;
} & React.DetailedHTMLProps<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
> &
  LinkProps &
  VariantProps<typeof styles>) {
  const {
    button,
    iconContainer: iconStyles,
    text,
  } = styles({ color, size, full });

  return (
    <Link
      className={button({ className: classNames?.button })}
      data-disabled={disabled === undefined ? false : disabled}
      {...rest}
    >
      {icon && (
        <div className={iconStyles({ className: classNames?.iconContainer })}>
          {icon}
        </div>
      )}
      <span className={text({ className: classNames?.text })}>{children}</span>
    </Link>
  );
}
