import InspirationView from "@/components/inspiration/InspirationView";

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const view =
    searchParams["view"] === "big_paint" ? "big_paint" : "inspiration";

  if (view === "inspiration") {
    return <InspirationView />;
  }

  if (view === "big_paint") {
    return "todo: big paint view to implement";
  }
}
