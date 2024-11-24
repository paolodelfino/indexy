// import minioClient from "@/minio/minioClient";
import { notFound } from "next/navigation";

export default async function Page() {
  return notFound();
  // const obj = await minioClient.getObject(
  //   "image",
  //   "f55c42277d59949ff7a86c44d298faf91d3b3d628f6baa42d9b2a86889f644df",
  // );

  // console.log(Buffer.concat(await obj.toArray()));
  // return "hello";
}
