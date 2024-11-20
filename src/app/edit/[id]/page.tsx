import BigPaintForm from "@/components/skeletons/Skeleton__BigPaintForm";
import InspirationForm from "@/components/skeletons/Skeleton__InspirationForm";
import Skeleton__QueryForm from "@/components/skeletons/Skeleton__QueryForm";

export default async function Page({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const type =
    searchParams["type"] === "big_paint"
      ? "big_paint"
      : searchParams["type"] === "query"
        ? "query"
        : "inspiration";

  if (type === "inspiration") return <InspirationForm id={params.id} />;
  else if (type === "big_paint") return <BigPaintForm id={params.id} />;
  else return <Skeleton__QueryForm values={params.id} />;
}
