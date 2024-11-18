import dynamic from "next/dynamic";

const InspirationView = dynamic(
  () => import("@/app/InspirationView"),
);
const BigPaintView = dynamic(
  () => import("@/app/BigPaintView"),
);

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // TODO: strings view
  const view =
    searchParams["view"] === "big_paint" ? "big_paint" : "inspiration";

  if (view === "inspiration") {
    return <InspirationView />;
  }

  if (view === "big_paint") {
    return <BigPaintView />;
  }
}
