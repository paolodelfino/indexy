import { z, ZodType } from "zod";
import { create } from "zustand";

export type FormField<Value, Meta> = {
  meta: Meta;
  value: Value;
  default: { meta: Meta; value: Value };
  error: string | undefined;
};

export type FormFields = { [key: string]: FormField<any, any> };

export type FormSchema = ZodType;

export type FormState<T extends FormFields, FormMeta> = {
  fields: T;
  schema: FormSchema;
  meta: FormMeta;
  isInvalid: boolean;
  error: string | undefined;
  onSubmit?: (form: FormState<T, FormMeta>) => void;
  values: () => { [key in keyof T]: T[key]["value"] };
  reset: () => void;
  setValue: <Key extends keyof T, Value extends T[Key]["value"]>(
    key: Key,
    value: Value,
  ) => void;
  setValues: (values: { [key in keyof T]: T[key]["value"] }) => void;
  setMeta: <Key extends keyof T, Value extends T[Key]["meta"]>(
    key: Key,
    value: Value,
  ) => void;
  setMetas: (metas: { [key in keyof T]: T[key]["meta"] }) => void;
  setFormMeta: (value: FormMeta) => void;
  setOnSubmit: (callback: (form: FormState<T, FormMeta>) => void) => void;
  submit: () => void;
};

export type FormValues<T extends ZodType> = {
  [key in NonNullable<keyof z.infer<T>>]: z.infer<T>[key];
};

export type FormHook<T extends FormFields, FormMeta> = ReturnType<
  typeof createForm<T, FormMeta>
>;

export function createForm<T extends FormFields, FormMeta>(
  schema: FormSchema,
  fields: T,
  meta: FormMeta,
) {
  return create<FormState<T, FormMeta>>((set, get, api) => {
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
    ): [fields: T, isInvalid: boolean, formError: string | undefined] {
      const result = schema.safeParse(values(fields));
      const errors = result.error?.flatten();

      const formError = errors?.formErrors[0];

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

      return [
        fields,
        errors !== undefined || formError !== undefined,
        formError,
      ];
    }

    const state: FormState<T, FormMeta> = {
      fields,
      schema: schema,
      meta,
      isInvalid: false,
      error: undefined,
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

          const [fields, isInvalid, formError] = validate(
            state.fields,
            state.schema,
          );

          return { fields, isInvalid, error: formError };
        });
      },
      setValues(values) {
        set((state) => {
          for (const key in values) state.fields[key].value = values[key];

          const [fields, isInvalid, formError] = validate(
            state.fields,
            state.schema,
          );

          return { fields, isInvalid, formError };
        });
      },
      setMeta(key, value) {
        set((state) => {
          state.fields[key].meta = value;
          return { fields: state.fields };
        });
      },
      setMetas(metas) {
        set((state) => {
          for (const key in metas) state.fields[key].meta = metas[key];

          return { fields: state.fields };
        });
      },
      setFormMeta(value) {
        set({ meta: value });
      },
      setOnSubmit(callback) {
        set({ onSubmit: callback });
      },
      submit() {
        const state = get();
        if (!state.isInvalid) state.onSubmit?.(state);
      },
    };

    const [_fields, isInvalid, formError] = validate(
      state.fields,
      state.schema,
    );
    state.fields = _fields;
    state.isInvalid = isInvalid;
    state.error = formError;

    return state;
  });
}



// export function useCreateLocalForm<T extends FormFields, FormMeta>(
//   schema: FormSchema,
//   fields: T,
//   meta: FormMeta,
// ) {
//   function validate(
//     fields: T,
//     schema: FormSchema,
//   ): [fields: T, isInvalid: boolean] {
//     const result = schema.safeParse(values());
//     const errors = result.error?.flatten();

//     function clearErrors(fields: T) {
//       return Object.entries(fields).reduce((acc, [key, value]) => {
//         acc[key as keyof T] = {
//           ...value,
//           error: undefined,
//         } as T[keyof T];
//         return acc;
//       }, {} as T);
//     }

//     fields = clearErrors(fields);

//     if (errors === undefined)
//       Object.entries(result.data as ReturnType<typeof values>).map(
//         ([field, value]) => {
//           fields[field].value = value;
//         },
//       );
//     else
//       Object.entries(errors.fieldErrors).map(([field, errors]) => {
//         fields[field].error = errors?.[0]; // TODO: Support for more than one error per field
//       });

//     return [fields, errors !== undefined];
//   }

//   const [_fields, setFields] = useState<T>(fields);
//   const [isInvalid, setIsInvalid] = useState(false);
//   const [onSubmit, _setOnSubmit] =
//     useState<FormState<T, FormMeta>["onSubmit"]>();
//   const [formMeta, _setFormMeta] =
//     useState<FormState<T, FormMeta>["meta"]>(meta);
//   const [formError, _setFormError] =
//     useState<FormState<T, FormMeta>["error"]>();

//   const reset: FormState<T, FormMeta>["reset"] = () => {
//     setFields(
//       Object.entries(_fields).reduce((acc, [key, value]) => {
//         acc[key as keyof T] = {
//           ...value,
//           meta: value.default.meta,
//           value: value.default.value,
//         } as T[keyof T];
//         return acc;
//       }, {} as T),
//     );
//   };

//   const values: FormState<T, FormMeta>["values"] = () => {
//     return Object.entries(_fields).reduce(
//       (acc, [key, value]) => {
//         acc[key as keyof T] = value.value;
//         return acc;
//       },
//       {} as {
//         [key in keyof T]: T[key]["value"];
//       },
//     );
//   };

//   const setValue: FormState<T, FormMeta>["setValue"] = (key, value) => {
//     const [fields, isInvalid] = validate(
//       { ..._fields, [key]: { ..._fields[key], value: value } },
//       schema,
//     );

//     setFields(fields);
//     setIsInvalid(isInvalid);
//   };

//   const setValues: FormState<T, FormMeta>["setValues"] = (values) => {
//     const [fields, isInvalid] = validate(
//       Object.entries(_fields).reduce((acc, [key, value]) => {
//         // @ts-expect-error
//         acc[key as keyof T] = { ...value, value: values[key] };

//         return acc;
//       }, {} as T),
//       schema,
//     );

//     setFields(fields);
//     setIsInvalid(isInvalid);
//   };

//   const setMeta: FormState<T, FormMeta>["setMeta"] = (key, value) => {
//     setFields({ ..._fields, [key]: { ..._fields[key], meta: value } });
//   };

//   const setMetas: FormState<T, FormMeta>["setMetas"] = (metas) => {
//     const [fields, isInvalid] = validate(
//       Object.entries(_fields).reduce((acc, [key, value]) => {
//         // @ts-expect-error
//         acc[key as keyof T] = { ...value, meta: metas[key] };

//         return acc;
//       }, {} as T),
//       schema,
//     );

//     setFields(fields);
//     setIsInvalid(isInvalid);
//   };

//   const setFormMeta: FormState<T, FormMeta>["setFormMeta"] = (value) => {
//     _setFormMeta(value);
//   };

//   const setOnSubmit: FormState<T, FormMeta>["setOnSubmit"] = (callback) => {
//     _setOnSubmit(() => callback);
//   };

//   const submit: FormState<T, FormMeta>["submit"] = () => {
//     if (!isInvalid)
//       onSubmit?.({
//         fields: _fields,
//         schema,
//         meta: formMeta,
//         error: formError,
//         isInvalid,
//         values,
//         reset,
//         setValue,
//         setValues,
//         setMeta,
//         setMetas,
//         setFormMeta,
//         setOnSubmit,
//         submit,
//       });
//   };

//   useEffect(() => {
//     const [fields, isInvalid, _formError] = validate(_fields, schema);

//     setFields(fields);
//     setIsInvalid(isInvalid);
//     _setFormError(_formError);
//   }, []);

//   return (() =>
//     ({
//       fields: _fields,
//       schema,
//       meta: formMeta,
//       error: formError,
//       isInvalid,
//       values,
//       reset,
//       setValue,
//       setValues,
//       setMeta,
//       setMetas,
//       setFormMeta,
//       setOnSubmit,
//       submit,
//     }) satisfies FormState<T, FormMeta>) as FormHook<T, FormMeta>;
// }
