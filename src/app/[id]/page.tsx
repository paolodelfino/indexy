import { lazy } from "react";

const BigPaintDetails = lazy(
  () => import("@/components/big_paint/BigPaintDetails"),
);
const InspirationDetails = lazy(
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
    return <BigPaintDetails id={params.id} />;
  } else {
    return <InspirationDetails id={params.id} />;
  }
}
