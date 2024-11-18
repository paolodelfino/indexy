import BigPaintDetails from "@/app/[id]/BigPaintDetails";
import InspirationDetails from "@/app/[id]/InspirationDetails";

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
  }

  if (type === "inspiration") {
    return <InspirationDetails id={params.id} />;
  }
}
