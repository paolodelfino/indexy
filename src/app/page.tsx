// const InspirationView = dynamic(() => import("@/app/InspirationView"));
// const BigPaintView = dynamic(() => import("@/app/BigPaintView"));
import Skeleton__QueryView from "@/components/skeletons/Skeleton__QueryView";

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // TODO: strings view
  return <Skeleton__QueryView />;
}
