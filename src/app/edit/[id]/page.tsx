import BigPaintForm from "@/app/edit/[id]/BigPaintForm";
import InspirationForm from "@/app/edit/[id]/InspirationForm";
import QueryForm from "@/app/edit/[id]/QueryForm";

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
  else return <QueryForm values={params.id} />;
}
