import { ClassValue } from "tailwind-variants";

// TODO: Remove
export type ComponentProps<T extends string> = {
  classNames?: SlotsToClasses<T>;
};

export type SlotsToClasses<S extends string> = {
  [key in S]?: ClassValue;
};
