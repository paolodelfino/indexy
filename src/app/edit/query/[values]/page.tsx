import FormEdit__Query from "@/components/forms/FormEdit__Query";
import { db } from "@/db/db";
import { notFound } from "next/navigation";

// TODO: History (using versioning)

export default async function Page({
  params: { values },
}: {
  params: { values: string };
}) {
  const entry = await db
    .selectFrom("query")
    .where("values", "=", values)
    .select(["values", "name", "date"])
    .executeTakeFirst();

  if (!entry) notFound();

  return <FormEdit__Query data={entry} />;
}
