import { z } from "zod";

export default z
  .string()
  .refine((value) =>
    /^([0-9]|[A-Za-z]){8}-([0-9]|[A-Za-z]){4}-([0-9]|[A-Za-z]){4}-([0-9]|[A-Za-z]){4}-([0-9]|[A-Za-z]){12}$/m.test(
      value,
    ),
  );
