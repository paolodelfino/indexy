"use server";
import { db } from "@/db/db";
import { ActionReturn } from "@/utils/actionType";

type Return = ActionReturn<{
  inspirations: {
    id: string;
    date: Date;
    content: string;
    highlight: boolean;
  }[];
  hasNext: boolean;
}>;

// const schema = z.object({
//   offset: z.number().positive(),
//   limit: z.number().positive(),
// });

export async function fetchInspirationsAction(
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
  const offset = prevState.data?.inspirations.length || 0;

  const inspirations = await db
    .selectFrom("inspiration")
    .orderBy("date")
    .offset(offset)
    .limit(limit)
    .select(["id", "content", "highlight", "date"])
    .execute();

  const hasNext = inspirations.length > 0;

  return {
    success: true,
    data: {
      inspirations: prevState?.data
        ? [...prevState.data.inspirations, ...inspirations]
        : inspirations,
      hasNext,
    },
  };
}
