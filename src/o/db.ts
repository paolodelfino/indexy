import fs from "fs";
import https from "https";
import { Client } from "minio";
import "server-only";

const customAgent = new https.Agent({
  ca: fs.readFileSync("./certificates/public.crt"),
});

const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT!,
  port: Number(process.env.MINIO_PORT!),
  useSSL: true,
  accessKey: process.env.MINIO_ACCESS_KEY!,
  secretKey: process.env.MINIO_SECRET!,
  transportAgent: customAgent,
});
export default minioClient;
