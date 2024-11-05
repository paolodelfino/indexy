import { useEffect, useState } from "react";
import { ZodType } from "zod";
import { create } from "zustand";

export type FormField<Value, Meta> = {
  meta: Meta;
  value: Value;
  default: { meta: Meta; value: Value };
  error: string | undefined;
};

export type FormFields = { [key: string]: FormField<any, any> };

export type FormSchema = ZodType;

export type FormState<T extends FormFields> = {
  fields: T;
  schema: FormSchema;
  isInvalid: boolean;
  onSubmit?: (form: FormState<T>) => void;
  values: () => { [key in keyof T]: T[key]["value"] };
  reset: () => void;
  setValue: <Key extends keyof T, Value extends T[Key]["value"]>(
    key: Key,
    value: Value,
  ) => void;
  setMeta: <Key extends keyof T, Value extends T[Key]["meta"]>(
    key: Key,
    value: Value,
  ) => void;
  setOnSubmit: (callback: (form: FormState<T>) => void) => void;
  submit: () => void;
};

// TODO: Add optional onSubmit parameter on createForm and createLocalForm

export function createForm<T extends FormFields>(
  schema: FormSchema,
  fields: T,
) {
  return create<FormState<T>>((set, get, api) => {
    function values(fields: T) {
      return Object.entries(fields).reduce(
        (acc, [key, value]) => {
          acc[key as keyof T] = value.value;
          return acc;
        },
        {} as {
          [key in keyof T]: T[key]["value"];
        },
      );
    }

    function validate(
      fields: T,
      schema: FormSchema,
    ): [fields: T, isInvalid: boolean] {
      const result = schema.safeParse(values(fields));
      const errors = result.error?.flatten();

      function clearErrors(fields: T) {
        return Object.entries(fields).reduce((acc, [key, value]) => {
          acc[key as keyof T] = {
            ...value,
            error: undefined,
          } as T[keyof T];
          return acc;
        }, {} as T);
      }

      fields = clearErrors(fields);

      if (errors === undefined)
        Object.entries(result.data as ReturnType<typeof values>).map(
          ([field, value]) => {
            fields[field].value = value;
          },
        );
      else
        Object.entries(errors.fieldErrors).map(([field, errors]) => {
          // TODO: Check for empty array?
          // TODO: Relation between isInvalid and errors being undefined?
          fields[field].error = errors?.[0]; // TODO: Support for more than one error per field
        });

      return [fields, errors !== undefined];
    }

    const state: FormState<T> = {
      fields,
      schema: schema,
      isInvalid: false,
      reset() {
        set((state) => ({
          fields: Object.entries(state.fields).reduce((acc, [key, value]) => {
            acc[key as keyof T] = {
              ...value,
              meta: value.default.meta,
              value: value.default.value,
            } as T[keyof T];
            return acc;
          }, {} as T),
        }));
      },
      values() {
        return values(get().fields);
      },
      setValue(key, value) {
        set((state) => {
          state.fields[key].value = value;

          const [fields, isInvalid] = validate(state.fields, state.schema);

          return { fields, isInvalid };
        });
      },
      setMeta(key, value) {
        set((state) => {
          state.fields[key].meta = value;
          return { fields: state.fields };
        });
      },
      setOnSubmit(callback) {
        set({ onSubmit: callback });
      },
      submit() {
        const state = get();
        if (!state.isInvalid) state.onSubmit?.(state);
      },
    };

    const [_fields, isInvalid] = validate(state.fields, state.schema);
    state.fields = _fields;
    state.isInvalid = isInvalid;

    return state;
  });
}

export type FormHook<T extends FormFields> = ReturnType<typeof createForm<T>>;

export function useCreateLocalForm<T extends FormFields>(
  schema: FormSchema,
  fields: T,
) {
  function validate(
    fields: T,
    schema: FormSchema,
  ): [fields: T, isInvalid: boolean] {
    const result = schema.safeParse(values());
    const errors = result.error?.flatten();

    function clearErrors(fields: T) {
      return Object.entries(fields).reduce((acc, [key, value]) => {
        acc[key as keyof T] = {
          ...value,
          error: undefined,
        } as T[keyof T];
        return acc;
      }, {} as T);
    }

    fields = clearErrors(fields);

    if (errors === undefined)
      Object.entries(result.data as ReturnType<typeof values>).map(
        ([field, value]) => {
          fields[field].value = value;
        },
      );
    else
      Object.entries(errors.fieldErrors).map(([field, errors]) => {
        fields[field].error = errors?.[0]; // TODO: Support for more than one error per field
      });

    return [fields, errors !== undefined];
  }

  const [_fields, setFields] = useState<T>(fields);
  const [isInvalid, setIsInvalid] = useState(false);
  const [onSubmit, _setOnSubmit] = useState<FormState<T>["onSubmit"]>();

  const reset: FormState<T>["reset"] = () => {
    setFields(
      Object.entries(_fields).reduce((acc, [key, value]) => {
        acc[key as keyof T] = {
          ...value,
          meta: value.default.meta,
          value: value.default.value,
        } as T[keyof T];
        return acc;
      }, {} as T),
    );
  };

  const values: FormState<T>["values"] = () => {
    return Object.entries(_fields).reduce(
      (acc, [key, value]) => {
        acc[key as keyof T] = value.value;
        return acc;
      },
      {} as {
        [key in keyof T]: T[key]["value"];
      },
    );
  };

  const setValue: FormState<T>["setValue"] = (key, value) => {
    const [fields, isInvalid] = validate(
      { ..._fields, [key]: { ..._fields[key], value: value } },
      schema,
    );

    setFields(fields);
    setIsInvalid(isInvalid);
  };

  const setMeta: FormState<T>["setMeta"] = (key, value) => {
    setFields({ ..._fields, [key]: { ..._fields[key], meta: value } });
  };

  const setOnSubmit: FormState<T>["setOnSubmit"] = (callback) => {
    _setOnSubmit(() => callback);
  };

  const submit: FormState<T>["submit"] = () => {
    if (!isInvalid)
      onSubmit?.({
        fields: _fields,
        schema,
        isInvalid,
        values,
        reset,
        setValue,
        setMeta,
        setOnSubmit,
        submit,
      });
  };

  useEffect(() => {
    const [fields, isInvalid] = validate(_fields, schema);

    setFields(fields);
    setIsInvalid(isInvalid);
  }, []);

  return (() => ({
    fields: _fields,
    schema,
    isInvalid,
    values,
    reset,
    setValue,
    setMeta,
    setOnSubmit,
    submit,
  })) as FormHook<T>;
}
