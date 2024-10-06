import { z } from "zod";

export const dateSchema = z.string().refine(
  (dateStr) => {
    return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?(\.\d{1})?(\d{2})?$/.test(
      dateStr,
    );
  },
  (input) => ({ message: "Invalid date: " + input }),
);
