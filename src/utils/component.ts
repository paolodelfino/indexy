import { ClassValue } from "tailwind-variants";

export type ComponentProps<T extends string> = {
  classNames?: SlotsToClasses<T>;
};

export type SlotsToClasses<S extends string> = {
  [key in S]?: ClassValue;
};

// type DateInputSlots = keyof ReturnType<typeof dateInput>;
