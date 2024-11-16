import { db } from "@/db/db";
import dynamic from "next/dynamic";
const BigPaintEditForm = dynamic(
  () => import("@/components/big_paint/BigPaintEditForm"),
);
const InspirationEditForm = dynamic(
  () => import("@/components/inspiration/InspirationEditForm"),
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

  if (type === "inspiration") {
    return <InspirationEditForm id={params.id} db={db} />;
  }

  if (type === "big_paint") {
    return <BigPaintEditForm id={params.id} db={db} />;
  }
}
