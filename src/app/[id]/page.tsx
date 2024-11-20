import Skeleton__BigPaintDetails from "@/components/skeletons/Skeleton__BigPaintDetails";
import Skeleton__InspirationDetails from "@/components/skeletons/Skeleton__InspirationDetails";

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
    return <Skeleton__BigPaintDetails id={params.id} />;
  }

  if (type === "inspiration") {
    return <Skeleton__InspirationDetails id={params.id} />;
  }
}
