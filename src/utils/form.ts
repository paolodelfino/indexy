import { ZodType } from "zod";
import { create } from "zustand";

export type FormState<T extends object> = T & {
  set: (values: Partial<T>) => void;
  reset: () => void;
  values: () => T;

  isInvalid: boolean;
  _errorsCount: number;
  pushError: () => void;
  popError: () => void;
};

export function createForm<T extends object>(emptyValues: T) {
  return create<FormState<T>>((_set, _get) => ({
    ...emptyValues,

    set(values) {
      _set({ ...values } as any);
    },
    reset() {
      _set({ ...emptyValues } as any);
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

    isInvalid: false,
    _errorsCount: 0,
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
