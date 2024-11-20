import dynamic from "next/dynamic";

const BigPaintCreateForm = dynamic(
  () => import("@/components/forms/FormCreate__BigPaint"),
);
const InspirationCreateForm = dynamic(
  () => import("@/components/forms/FormCreate__Inspiration"),
);

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const type =
    searchParams["type"] === "big_paint" ? "big_paint" : "inspiration";

  if (type === "big_paint") {
    return <BigPaintCreateForm />;
  }

  if (type === "inspiration") {
    return <InspirationCreateForm />;
  }
}
