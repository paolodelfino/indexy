"use server";

import minioClient from "@/minio/minioClient";
import { z } from "zod";

export default async function ActionFetch__Resources(values: {
  resources: { sha256: string; type: "image" | "binary"; n: number }[];
}) {
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
    validated.resources.map(async ({ sha256, type, n }) => {
      const buffer = Buffer.concat(
        await (await minioClient.getObject(type, sha256)).toArray(),
      );
      // console.log("buffer", buffer);
      const t = buffer.buffer.slice(
        buffer.byteOffset,
        buffer.byteOffset + buffer.byteLength,
      );
      return {
        sha256,
        type,
        n,
        buff:
          t instanceof SharedArrayBuffer ? new ArrayBuffer(t.byteLength) : t, // TODO: Is this bullshit necessary?
      };
    }),
  );
}
