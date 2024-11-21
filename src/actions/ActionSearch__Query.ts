"use server";

import { db } from "@/db/db";
import schemaQuery__Search from "@/schemas/schemaQuery__Search";
import { FormValues } from "@/utils/form";
import { z } from "zod";

export default async function ActionSearch__Query(
  _offset: number,
  _limit: number,
  values: FormValues<typeof schemaQuery__Search>,
) {
  const offset = z.number().int().gte(0).parse(_offset); // TODO: Remove optional
  const limit = z.number().int().gte(0).parse(_limit); // TODO: Remove optional
  const { name } = schemaQuery__Search.parse(values);

  const q = db.selectFrom("query").where("name", "~", name);

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
