"use server";

import { db } from "@/r/db";
import schemaQuery__Query from "@/schemas/schemaQuery__Query";
import { FormValues } from "@/utils/form";
import { z } from "zod";

export default async function ActionQuery__Query(
  _offset: number,
  _limit: number,
  values: FormValues<typeof schemaQuery__Query>,
) {
  const offset = z.number().int().gte(0).parse(_offset); // TODO: Remove optional
  const limit = z.number().int().gte(0).parse(_limit); // TODO: Remove optional
  const { name, category } = schemaQuery__Query.parse(values);

  const q = db
    .selectFrom("query")
    .where("name", "~", name)
    .where("category", "=", category);

  return {
    data: await q.selectAll().offset(offset).limit(limit).execute(),
    total: Number(
      (
        await q
          .select((eb) => eb.fn.countAll().as("total"))
          .executeTakeFirstOrThrow()
      ).total,
    ),
  };
}
