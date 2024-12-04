import { ButtonLink } from "@/components/Button";
import minioClient from "@/o/db";
import { db } from "@/r/db";
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

  const object = await minioClient.getObject(type, sha256);

  let view;
  if (type === "image") {
    view = (
      <img
        alt=""
        src={`https://${process.env.MINIO_ADDRESS}/${type}/${sha256}`}
      />
    );
  } else if (type === "video") {
    view = (
      <video controls>
        <source src={`https://${process.env.MINIO_ADDRESS}/${type}/${sha256}`} />
      </video>
    );
  } else if (type === "audio") {
    view = (
      <audio controls>
        <source src={`https://${process.env.MINIO_ADDRESS}/${type}/${sha256}`} />
      </audio>
    );
  } else {
    const chunks = [];
    for await (const chunk of object) {
      chunks.push(chunk);
    }
    const text = Buffer.concat(chunks).toString("utf-8");
    view = <p className="whitespace-pre-wrap bg-black text-white">{text}</p>;
  }

  return (
    <div className="pb-32">
      <ButtonLink
        href={`https://${process.env.MINIO_ADDRESS}/${type}/${sha256}`}
      >
        Download
      </ButtonLink>
      {view}
    </div>
  );
}
