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
    searchParams["type"] === "big_paint"
      ? "big_paint"
      : searchParams["type"] === "big_paint_history"
        ? "big_paint_history"
        : searchParams["type"] === "inspiration_history"
          ? "inspiration_history"
          : "inspiration";

  if (type === "inspiration") return <InspirationEditForm id={params.id} />;
  else if (type === "big_paint") return <BigPaintEditForm id={params.id} />;
  else if (type === "inspiration_history")
    throw new Error("TODO: Unimplemented");
  else if (type === "big_paint_history") throw new Error("TODO: Unimplemented");
}
