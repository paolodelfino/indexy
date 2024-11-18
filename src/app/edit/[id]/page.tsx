import BigPaintEditForm from "@/app/edit/[id]/BigPaintEditForm";
import InspirationEditForm from "@/app/edit/[id]/InspirationEditForm";

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
    return <InspirationEditForm id={params.id} />;
  }

  if (type === "big_paint") {
    return <BigPaintEditForm id={params.id} />;
  }
}
