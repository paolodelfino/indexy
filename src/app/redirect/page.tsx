import type { Metadata } from "next";
import { redirect, RedirectType } from "next/navigation";

export default function Page({
  searchParams,
}: {
  searchParams: { url: string };
}) {
  redirect(searchParams.url, RedirectType.replace);
}

export function generateMetadata(): Metadata {
  return {
    robots: {
      index: false,
      follow: false,
    },
  };
}
