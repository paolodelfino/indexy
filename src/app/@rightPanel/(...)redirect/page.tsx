import DetailsPage from "@/app/[id]/page";
import CreatePage from "@/app/create/page";
import EditPage from "@/app/edit/[id]/page";
import { getParams, normalizeSearchParams } from "@/utils/url";
import { notFound } from "next/navigation";

export default async function _Page({
  searchParams: _searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const url = new URL(_searchParams["url"] as string, "http://localhost:3000");
  const pathname = url.pathname;
  const searchParams = normalizeSearchParams(url.searchParams);

  if (pathname === "/create") {
    return CreatePage({ searchParams });
  }

  if (pathname.startsWith("/edit")) {
    const params = getParams(pathname);
    return EditPage({ searchParams, params: { id: params[0] } });
  }

  if (pathname.startsWith("/")) {
    // Should be used on /[id]
    const params = getParams(pathname, true);
    return DetailsPage({ searchParams, params: { id: params[0] } });
  }

  notFound();
}
