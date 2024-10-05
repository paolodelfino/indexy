import { useEffect, useState } from "react";
import { ZodType } from "zod";

export function useValidationError<T>(
  value: T,
  validation: ZodType,
  formPushError: () => void,
  formPopError: () => void,
) {
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    const result = validation.safeParse(value);
    if (result.success && error !== undefined) {
      setError(undefined);
      formPopError();
    } else if (!result.success) {
      const formattedError = result.error.errors
        .map((err) => err.message)
        .join(", ");
      if (error === undefined) {
        formPushError();
      }
      setError(formattedError);
    }
  }, [value]);

  return error;
}
