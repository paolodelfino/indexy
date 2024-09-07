import { db } from "@/db/db";
import dynamic from "next/dynamic";

const BigPaintDetails = dynamic(
  () => import("@/components/big_paint/BigPaintDetails"),
);
const InspirationDetails = dynamic(
  () => import("@/components/inspiration/InspirationDetails"),
);

export default async function Page({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const type =
    searchParams["type"] === "big_paint" ? "big_paint" : "inspiration";

  if (type === "big_paint") {
    return <BigPaintDetails id={params.id} db={db} />;
  }

  if (type === "inspiration") {
    return <InspirationDetails id={params.id} db={db} />;
  }
}
