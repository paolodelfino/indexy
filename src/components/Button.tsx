import Link, { LinkProps } from "next/link";
import { tv, VariantProps } from "tailwind-variants";

const styles = tv({
  base: "overflow-hidden text-ellipsis hyphens-auto whitespace-nowrap break-words flex gap-2 text-start m-px w-min",
  variants: {
    color: {
      ghost:
        "ring-neutral-600 disabled:text-neutral-500 [&:not(:disabled):active]:!bg-neutral-700 [&:not(:disabled):active]:!ring-1 [&:not(:disabled):hover]:bg-neutral-600 [&:not(:disabled):hover]:ring-0",
      default:
        "bg-neutral-800 ring-1 ring-neutral-600 disabled:text-neutral-500 [&:not(:disabled):active]:!bg-neutral-700 [&:not(:disabled):active]:!ring-1 [&:not(:disabled):hover]:bg-neutral-600 [&:not(:disabled):hover]:ring-0",
      accent:
        "bg-blue-500 ring-1 ring-blue-300 disabled:text-blue-200 [&:not(:disabled):active]:!bg-blue-300 [&:not(:disabled):active]:!ring-1 [&:not(:disabled):hover]:bg-blue-300 [&:not(:disabled):hover]:ring-0",
      danger:
        "bg-red-800 ring-1 ring-red-600 disabled:text-red-500 [&:not(:disabled):active]:!bg-red-700 [&:not(:disabled):active]:!ring-1 [&:not(:disabled):hover]:bg-red-600 [&:not(:disabled):hover]:ring-0",
    },
    size: {
      default: "rounded-xl py-1 px-2",
      large: "p-3",
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
  className,
  color = "default",
  size = "default",
  children,
  type = "button",
  ...rest
}: {
  children: React.ReactNode;
} & React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> &
  VariantProps<typeof styles>) {
  return (
    <button
      className={styles({ className: className, color, size })}
      type={type}
      {...rest}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  className,
  color = "default",
  size = "default",
  children,
  ...rest
}: {
  children: React.ReactNode;
} & React.DetailedHTMLProps<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
> &
  LinkProps &
  VariantProps<typeof styles>) {
  return (
    <Link className={styles({ className: className, color, size })} {...rest}>
      {children}
    </Link>
  );
}
