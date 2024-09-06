"use server";
import { db } from "@/db/db";
import { ActionReturn } from "@/utils/actionType";

type Return = ActionReturn<{
  message: string;
}>;

export async function deleteBigPaintAction(
  id: string,
  prevState: Awaited<Return>,
): Return {
  if (!prevState.success) {
    return {
      success: false,
      errors: "Aborted because previous state is unsuccessful",
    };
  }

  await db.deleteFrom("big_paint").where("id", "=", id).execute();

  return {
    success: true,
    data: { message: "BigPaint deleted successfully" },
  };
}
