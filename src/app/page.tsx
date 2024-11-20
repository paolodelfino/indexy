// const InspirationView = dynamic(() => import("@/app/InspirationView"));
// const BigPaintView = dynamic(() => import("@/app/BigPaintView"));
import BigPaintView from "@/app/BigPaintView";
import InspirationView from "@/app/InspirationView";
import QueryView from "@/app/QueryView";

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // TODO: strings view
  const view =
    searchParams["view"] === "big_paint"
      ? "big_paint"
      : searchParams["view"] === "query"
        ? "query"
        : "inspiration";

  if (view === "inspiration") return <InspirationView />;
  else if (view === "big_paint") return <BigPaintView />;
  else return <QueryView />;
}
