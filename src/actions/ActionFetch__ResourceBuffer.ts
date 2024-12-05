"use server";

import minioClient from "@/o/db";
import schemaResource__Fetch__Buffer from "@/schemas/schemaResource__Fetch__Buffer";
import { FormValues } from "@/utils/form";

export default async function ActionFetch__ResourceBuffer(
  values: FormValues<typeof schemaResource__Fetch__Buffer>,
) {
  const { sha256, type } = schemaResource__Fetch__Buffer.parse(values);
  const object = await minioClient.getObject(type, sha256);

  const chunks = [];
  let length = 0;
  for await (const chunk of object) {
    if ((length += chunk.byteLength) > 1024) {
      const remaining = 1024 - (length - chunk.byteLength);
      chunks.push(
        chunk.slice(0, remaining),
        Buffer.from("\r\n--- BIG FILE CUT OFF ---"),
      );
      break;
    } else chunks.push(chunk);
  }

  return Buffer.concat(chunks).toString("utf-8");
}
