import { lazy } from "react";

const BigPaintCreate = lazy(
  () => import("@/components/big_paint/BigPaintCreate"),
);
const InspirationCreate = lazy(
  () => import("@/components/inspiration/InspirationCreate"),
);

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const type =
    searchParams["type"] === "big_paint" ? "big_paint" : "inspiration";

  if (type === "big_paint") {
    return <BigPaintCreate />;
  } else {
    return <InspirationCreate />;
  }
}
