"use server";

import minioClient from "@/minio/minioClient";
import schemaResource__InjectBuffer from "@/schemas/schemaResource__InjectBuffer";
import { FormValues } from "@/utils/form";
import { z } from "zod";

export default async function ActionInjectBuffer__Resource(
  values: FormValues<typeof schemaResource__InjectBuffer>,
) {
  const validated = z
    .object({
      resources: z.array(
        z.object({
          sha256: z
            .string()
            .trim()
            .regex(/^[a-f0-9]{64}$/i, "Invalid SHA-256 hash"),
          type: z.enum(["image", "binary"]),
          n: z.number().gt(0),
        }),
      ),
    })
    .parse(values);
  return await Promise.all(
    validated.resources.map(async (it) => {
      const buffer = Buffer.concat(
        await (await minioClient.getObject(it.type, it.sha256)).toArray(),
      );
      // console.log("buffer", buffer);
      const t = buffer.buffer.slice(
        buffer.byteOffset,
        buffer.byteOffset + buffer.byteLength,
      );
      return {
        ...it,
        buff:
          t instanceof SharedArrayBuffer ? new ArrayBuffer(t.byteLength) : t, // TODO: Is this bullshit necessary?
      };
    }),
  );
}
