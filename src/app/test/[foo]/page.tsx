"use client";

// import { formValuesFromString } from "@/utils/url";
import { notFound } from "next/navigation"

export default function Page({
  params: { foo },
  searchParams,
}: {
  params: { foo: string };
  searchParams: any;
}) {
  return notFound()
  // console.log(formValuesFromString(foo));
  // return foo;
}
