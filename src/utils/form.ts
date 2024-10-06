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

// export function createFormHook<T extends object>(emptyValues: T): FormState<T> {
//   const [state, setState] = useState<
//     T & { isInvalid: boolean; _errorsCount: number }
//   >({ ...emptyValues, isInvalid: false, _errorsCount: 0 });

//   const set: (values: Partial<T>) => void = (values) => {
//     setState((state) => ({ ...state, ...values }));
//   };
//   const reset: () => void = () => {
//     setState((state) => ({ ...state, ...emptyValues }));
//   };
//   const values: () => T = () => {
//     const {
//       _errorsCount,
//       isInvalid,
//       /* Change above whenever you update form interface */ ...rest
//     } = state;
//     return rest as any;
//   };

//   const pushError: () => void = () => {
//     const _errorsCount = ++state._errorsCount;
//     const isInvalid = _errorsCount > 0;
//     setState((state) => ({ ...state, _errorsCount, isInvalid }));
//   };
//   const popError: () => void = () => {
//     const _errorsCount = Math.max(0, --state._errorsCount);
//     const isInvalid = _errorsCount > 0;
//     setState((state) => ({ ...state, _errorsCount, isInvalid }));
//   };

//   return {
//     ...state,
//     set,
//     reset,
//     values,
//     pushError,
//     popError,
//   };
// }

export type FormHook<T extends object> = ReturnType<typeof createForm<T>>;

export type FormFieldProps<T> = {
  value: T;
  setValue: (value: T) => void;
  validation: ZodType;
  formPushError: () => void;
  formPopError: () => void;
  disabled: boolean;
};
