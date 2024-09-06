"use server";
import { db } from "@/db/db";
import { ActionReturn } from "@/utils/actionType";

type Return = ActionReturn<{
  message: string;
}>;

export async function deleteInspirationAction(
  id: string,
  prevState: Awaited<Return>,
): Return {
  if (!prevState.success) {
    return {
      success: false,
      errors: "Aborted because previous state is unsuccessful",
    };
  }

  await db.deleteFrom("inspiration").where("id", "=", id).execute();

  return {
    success: true,
    data: { message: "Inspiration deleted successfully" },
  };
}
