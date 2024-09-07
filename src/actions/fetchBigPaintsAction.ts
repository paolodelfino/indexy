"use server";
import { db } from "@/db/db";
import { ActionReturn } from "@/utils/actionType";

type Return = ActionReturn<{
  bigPaints: {
    id: string;
    date: Date;
    name: string;
  }[];
  hasNext: boolean;
}>;

// const schema = z.object({
//   offset: z.number().positive(),
//   limit: z.number().positive(),
// });

export async function fetchBigPaintsAction(
  prevState: Awaited<Return>,
  // formData: FormData,
): Return {
  // const validatedFields = schema.safeParse({
  //   offset: Number(formData.get("offset")),
  //   limit: Number(formData.get("limit")),
  // });

  // if (!validatedFields.success) {
  //   return {
  //     success: false,
  //     errors: validatedFields.error,
  //   };
  // }

  // const { limit, offset } = validatedFields.data;

  const limit = 20;
  const offset = prevState.data?.bigPaints.length || 0;

  const bigPaints = await db
    .selectFrom("big_paint")
    .orderBy("date")
    .offset(offset)
    .limit(limit)
    .select(["id", "name", "date"])
    .execute();

  const hasNext = bigPaints.length > 0;

  return {
    success: true,
    data: {
      bigPaints: prevState?.data
        ? [...prevState.data.bigPaints, ...bigPaints]
        : bigPaints,
      hasNext,
    },
  };
}
