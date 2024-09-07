import { db } from "@/db/db";
import dynamic from "next/dynamic";

const BigPaintEdit = dynamic(
  () => import("@/components/big_paint/BigPaintEdit"),
);
const InspirationEdit = dynamic(
  () => import("@/components/inspiration/InspirationEdit"),
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
    return <BigPaintEdit db={db} id={params.id} />;
  }

  if (type === "inspiration") {
    return <InspirationEdit db={db} id={params.id} />;
  }
}
