"use server";

import { db } from "@/db/db";
import minioClient from "@/minio/minioClient";
import schemaEntry__InspirationPool__Fetch from "@/schemas/schemaEntry__InspirationPool__Fetch";
import { FormValues } from "@/utils/form";
import { sql } from "kysely";
import { z } from "zod";

export default async function ActionFetch__InspirationPool(
  offset: number,
  limit: number,
  values: FormValues<typeof schemaEntry__InspirationPool__Fetch>,
) {
  const { limit: validatedLimit, offset: validatedOffset } = z
    .object({ offset: z.number().gt(0), limit: z.number().gt(0) })
    .parse({ offset, limit });
  const { id, type } = schemaEntry__InspirationPool__Fetch.parse(values);

  if (type === "inspiration") {
    const q = db
      .selectFrom((te) =>
        te
          .selectFrom("inspiration_relations as ir")
          .where((eb) =>
            eb.or([
              eb("ir.inspiration1_id", "=", id),
              eb("ir.inspiration2_id", "=", id),
            ]),
          )
          .select((eb) =>
            eb
              .case()
              .when("ir.inspiration1_id", "!=", id)
              .then("ir.inspiration1_id")
              .when("ir.inspiration2_id", "!=", id)
              .then("ir.inspiration2_id")
              .endCase()
              .$notNull()
              .as("inspiration_id"),
          )
          .as("r"),
      )
      .innerJoin("inspiration as i", "i.id", "r.inspiration_id");

    const a = await q
      .select([
        "i.content",
        "i.date",
        "i.id",
        "i.highlight",
        db
          .selectFrom("inspiration_relations as ir")
          .select(
            db.fn
              .coalesce(db.fn.countAll(), sql<number>`0`)
              .$castTo<string>()
              .$notNull()
              .as("num_related_inspirations"),
          )
          .where((eb) =>
            eb.or([
              eb("ir.inspiration1_id", "=", sql<string>`"id"`),
              eb("ir.inspiration2_id", "=", sql<string>`"id"`),
            ]),
          )
          .as("num_related_inspirations"),
        db
          .selectFrom("big_paint_inspiration_relations as bir")
          .select(
            db.fn
              .coalesce(db.fn.countAll(), sql<number>`0`)
              .$castTo<string>()
              .$notNull()
              .as("num_related_big_paints"),
          )
          .whereRef("bir.inspiration_id", "=", "id")
          .as("num_related_big_paints"),
      ])
      .offset(validatedOffset)
      .limit(validatedLimit)
      .execute();

    const b = await Promise.all(
      a.map(async (it) => {
        // TODO: Can we join the previous query?
        const resources = await db
          .selectFrom("resource")
          .where("inspiration_id", "=", it.id)
          .selectAll()
          .execute();

        return {
          ...it,
          resources: await Promise.all(
            resources.map(async ({ inspiration_id, ...rest }) => {
              const a = Buffer.concat(
                await (
                  await minioClient.getObject(rest.type, rest.sha256)
                ).toArray(),
              );
              const b = a.buffer.slice(
                a.byteOffset,
                a.byteOffset + a.byteLength,
              );
              return {
                ...rest,
                buff:
                  b instanceof SharedArrayBuffer
                    ? new ArrayBuffer(b.byteLength)
                    : b, // TODO: Is this bullshit necessary?
              };
            }),
          ),
        };
      }),
    );

    return {
      data: b,
      total: Number(
        (
          await q
            .select((eb) => eb.fn.countAll().as("total"))
            .executeTakeFirstOrThrow()
        ).total,
      ),
    };
  } else {
    const q = db
      .selectFrom((te) =>
        te
          .selectFrom("big_paint_inspiration_relations as bir")
          .where("bir.inspiration_id", "=", id)
          .select("bir.inspiration_id")
          .as("r"),
      )
      .innerJoin("inspiration as i", "i.id", "r.inspiration_id");

    const a = await q
      .select([
        "i.content",
        "i.date",
        "i.id",
        "i.highlight",
        db
          .selectFrom("inspiration_relations as ir")
          .select(
            db.fn
              .coalesce(db.fn.countAll(), sql<number>`0`)
              .$castTo<string>()
              .$notNull()
              .as("num_related_inspirations"),
          )
          .where((eb) =>
            eb.or([
              eb("ir.inspiration1_id", "=", sql<string>`"id"`),
              eb("ir.inspiration2_id", "=", sql<string>`"id"`),
            ]),
          )
          .as("num_related_inspirations"),
        db
          .selectFrom("big_paint_inspiration_relations as bir")
          .select(
            db.fn
              .coalesce(db.fn.countAll(), sql<number>`0`)
              .$castTo<string>()
              .$notNull()
              .as("num_related_big_paints"),
          )
          .whereRef("bir.inspiration_id", "=", "id")
          .as("num_related_big_paints"),
      ])
      .offset(validatedOffset)
      .limit(validatedLimit)
      .execute();

    const b = await Promise.all(
      a.map(async (it) => {
        // TODO: Can we join the previous query?
        const resources = await db
          .selectFrom("resource")
          .where("inspiration_id", "=", it.id)
          .selectAll()
          .execute();

        return {
          ...it,
          resources: await Promise.all(
            resources.map(async ({ inspiration_id, ...rest }) => {
              const a = Buffer.concat(
                await (
                  await minioClient.getObject(rest.type, rest.sha256)
                ).toArray(),
              );
              const b = a.buffer.slice(
                a.byteOffset,
                a.byteOffset + a.byteLength,
              );
              return {
                ...rest,
                buff:
                  b instanceof SharedArrayBuffer
                    ? new ArrayBuffer(b.byteLength)
                    : b, // TODO: Is this bullshit necessary?
              };
            }),
          ),
        };
      }),
    );

    return {
      data: b,
      total: Number(
        (
          await q
            .select((eb) => eb.fn.countAll().as("total"))
            .executeTakeFirstOrThrow()
        ).total,
      ),
    };
  }
}
