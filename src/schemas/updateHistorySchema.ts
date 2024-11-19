import { z } from "zod";

export const idSchema = z.string().trim().min(3);

const updateHistorySchema = z.object({
  values: idSchema,
  date: z.date().optional(), // TODO: Add date range check
  name: z.string().trim().min(1).nullable().optional(),
});

export const editHistoryEntryFormSchema = z.object({
  name: z.string().trim().min(1).nullable(),
});

export default updateHistorySchema;
