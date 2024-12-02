import { ButtonLink } from "@/components/Button";
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

  let view;
  if (type === "image") {
    const bin = new Uint8Array(buff).reduce(
      (bin, byte) => (bin += String.fromCharCode(byte)),
      "",
    );
    const base64 = btoa(bin);
    view = <img alt="" src={`data:image;base64,${base64}`} />;
  } else if (type === "video") {
    const bin = new Uint8Array(buff).reduce(
      (bin, byte) => (bin += String.fromCharCode(byte)),
      "",
    );
    const base64 = btoa(bin);
    // TODO: Hardcoded mime
    // TODO: Doensn't work on safari
    view = (
      <video controls>
        <source src={`data:video/mp4;base64,${base64}`} />
      </video>
    );
  } else if (type === "audio") {
    const bin = new Uint8Array(buff).reduce(
      (bin, byte) => (bin += String.fromCharCode(byte)),
      "",
    );
    const base64 = btoa(bin);
    // TODO: Hardcoded mime
    view = (
      <audio controls>
        <source src={`data:audio/mp3;base64,${base64}`} />
      </audio>
    );
  } else {
    const bin = new Uint8Array(buff).reduce(
      (bin, byte) => (bin += String.fromCharCode(byte)),
      "",
    );
    view = <p className="whitespace-pre-wrap bg-black text-white">{bin}</p>;
  }

  // TODO: Scarica senza estensione
  return (
    <div>
      <ButtonLink href={`http://127.0.0.1:9000/${type}/${sha256}`}>
        Download
      </ButtonLink>
      {view}
    </div>
  );
}
