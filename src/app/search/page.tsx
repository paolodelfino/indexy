import dynamic from "next/dynamic";

const SearchInspirationForm = dynamic(
  () => import("@/components/inspiration/InspirationSearchForm"),
);
const SearchBigPaintForm = dynamic(
  () => import("@/components/big_paint/BigPaintSearchForm"),
);

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const type =
    searchParams["type"] === "big_paint" ? "big_paint" : "inspiration";

  if (type === "big_paint") {
    return <SearchBigPaintForm />;
  }

  if (type === "inspiration") {
    return <SearchInspirationForm />;
  }
}
