import { db } from "@/db/db";
import minioClient from "@/minio/minioClient";
import schemaResource__View from "@/schemas/schemaResource__View";

export default async function Page({
  params: values,
}: {
  params: { id: string };
}) {
  const { id } = schemaResource__View.parse(values);
  
  const { sha256, type } = await db
    .selectFrom("resource")
    .where("id", "=", id)
    .select(["type", "sha256"])
    .executeTakeFirstOrThrow();
    
  const a = Buffer.concat(
    await (await minioClient.getObject(type, sha256)).toArray(),
  );
  const b = a.buffer.slice(a.byteOffset, a.byteOffset + a.byteLength);
  const buff =
    b instanceof SharedArrayBuffer ? new ArrayBuffer(b.byteLength) : b; // TODO: Is this bullshit necessary?

  if (type === "image") {
    const bin = new Uint8Array(buff).reduce(
      (bin, byte) => (bin += String.fromCharCode(byte)),
      "",
    );
    const base64 = btoa(bin);
    return <img alt="" src={`data:image;base64,${base64}`} />;
  } else {
    const bin = new Uint8Array(buff).reduce(
      (bin, byte) => (bin += String.fromCharCode(byte)),
      "",
    );
    return <p className="whitespace-pre-wrap bg-black text-white">{bin}</p>;
  }
}
