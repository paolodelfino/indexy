import { z, ZodType } from "zod";
import { create } from "zustand";

type InternalValues = { isInvalid: boolean; _errorsCount: number };

export type FormState<T extends object> = T &
  InternalValues & {
    set: (values: Partial<T>) => void;
    reset: () => void;
    values: () => T;

    pushError: () => void;
    popError: () => void;
  };

export function createForm<T extends object>(defaultValues: T) {
  const internalValuesDefault: InternalValues = {
    isInvalid: true,
    _errorsCount: 0,
  };

  return create<FormState<T>>((_set, _get) => ({
    ...defaultValues,

    set(values) {
      let { isInvalid, _errorsCount } = _get();
      if (isInvalid && _errorsCount === 0) isInvalid = false;
      _set({ isInvalid, ...values } as any);
    },
    reset() {
      _set({ ...defaultValues, ...internalValuesDefault } as any);
    },
    values() {
      const {
        set,
        reset,
        values,
        _errorsCount,
        isInvalid,
        popError,
        pushError,
        /* Change above whenever you update form interface */ ...rest
      } = _get();
      return rest as any;
    },

    ...internalValuesDefault,
    pushError() {
      const _errorsCount = ++_get()._errorsCount;
      const isInvalid = _errorsCount > 0;
      _set({ _errorsCount, isInvalid } as any);
    },
    popError() {
      const _errorsCount = Math.max(0, --_get()._errorsCount);
      const isInvalid = _errorsCount > 0;
      _set({ _errorsCount, isInvalid } as any);
    },
  }));
}

export type FormHook<T extends object> = ReturnType<typeof createForm<T>>;

export type FormFieldProps<T> = {
  value: T;
  setValue: (value: T) => void;
  validation: ZodType;
  formPushError: () => void;
  formPopError: () => void;
  disabled: boolean;
};

export type FormValues<T extends ZodType> = {
  [key in NonNullable<keyof z.infer<T>>]: z.infer<T>[key];
};
