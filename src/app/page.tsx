// const InspirationView = dynamic(() => import("@/app/InspirationView"));
// const BigPaintView = dynamic(() => import("@/app/BigPaintView"));
import BigPaintHistoryView from "@/app/BigPaintHistoryView";
import BigPaintView from "@/app/BigPaintView";
import InspirationHistoryView from "@/app/InspirationHistoryView";
import InspirationView from "@/app/InspirationView";

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // TODO: strings view
  const view =
    searchParams["view"] === "big_paint"
      ? "big_paint"
      : searchParams["view"] === "big_paint_history"
        ? "big_paint_history"
        : searchParams["view"] === "inspiration_history"
          ? "inspiration_history"
          : "inspiration";

  if (view === "inspiration") return <InspirationView />;
  else if (view === "big_paint") return <BigPaintView />;
  else if (view === "inspiration_history") return <InspirationHistoryView />;
  else if (view === "big_paint_history") return <BigPaintHistoryView />;
}
