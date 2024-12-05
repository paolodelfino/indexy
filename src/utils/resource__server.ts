// NOTE: I made some changes to how I use resources and since I'm not using this code anymore, I don't even want to waste time maintaining it, but I'm leaving it here, for now

// import "server-only";
// import minioClient from "@/o/db";
// import schemaResource__InjectBuffer from "@/schemas/schemaResource__InjectBuffer";
// import { FormValues } from "@/utils/form";

// export async function resourceInjectBuffer(
//   values: FormValues<typeof schemaResource__InjectBuffer>,
// ) {
//   const validated = schemaResource__InjectBuffer.parse(values);
//   return await Promise.all(
//     validated.resources.map(async (it) => {
//       const buffer = Buffer.concat(
//         await (await minioClient.getObject(it.type, it.sha256)).toArray(),
//       );
//       // console.log("buffer", buffer);
//       const t = buffer.buffer.slice(
//         buffer.byteOffset,
//         buffer.byteOffset + buffer.byteLength,
//       );
//       return {
//         ...it,
//         buff:
//           t instanceof SharedArrayBuffer ? new ArrayBuffer(t.byteLength) : t, // TODO: Is this bullshit necessary?
//       };
//     }),
//   );
// }
