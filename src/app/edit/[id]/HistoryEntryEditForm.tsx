import HistoryEntryEditFormView from "@/app/edit/[id]/HistoryEntryEditFormView";
import { db } from "@/db/db";
import { notFound } from "next/navigation";

// TODO: History (using versioning)

export default async function HistoryEntryEditForm({
  id, // TODO: Ottima occasione per scoprire una cosa nuova: questo è un server component come chi lo chiama, vedi se questo riceve l'id encodato anche se l'altro glielo manda decodato
  type,
}: {
  id: string;
  type: "inspiration_history" | "big_paint_history";
}) {
  const entry = await db
    .selectFrom(
      type === "inspiration_history"
        ? "inspiration_search_history"
        : "big_paint_search_history",
    )
    .where("values", "=", decodeURIComponent(id))
    .select(["values", "name"])
    .executeTakeFirst();

  if (!entry) notFound();

  return <HistoryEntryEditFormView data={entry} type={type} />;
}
