import FormEdit__Query from "@/components/forms/FormEdit__Query";
import { db } from "@/db/db";
import { notFound } from "next/navigation";

// TODO: History (using versioning)

export default async function Skeleton__QueryForm({
  values, // TODO: Ottima occasione per scoprire una cosa nuova: questo è un server component come chi lo chiama, vedi se questo riceve l'id encodato anche se l'altro glielo manda decodato
}: {
  values: string;
}) {
  const entry = await db
    .selectFrom("query")
    .where("values", "=", decodeURIComponent(values))
    .select(["values", "name", "date"])
    .executeTakeFirst();

  if (!entry) notFound();

  return <FormEdit__Query data={entry} />;
}
