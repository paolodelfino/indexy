import { lazy } from "react";

const InspirationView = lazy(
  () => import("@/components/inspiration/InspirationView"),
);
const BigPaintView = lazy(() => import("../components/big_paint/BigPaintView"));

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const view =
    searchParams["view"] === "big_paint" ? "big_paint" : "inspiration";

  if (view === "inspiration") {
    return <InspirationView />;
  }

  if (view === "big_paint") {
    return <BigPaintView />;
  }
}
