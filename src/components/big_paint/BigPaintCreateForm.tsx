"use client";
import { createBigPaintAction } from "@/actions/createBigPaintAction";
import { useQueryClient } from "@tanstack/react-query";
import Form from "next/form";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";

export default function BigPaintCreateForm() {
  const router = useRouter();

  const [_, action, isPending] = useActionState(createBigPaintAction, void 0);

  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isPending) queryClient.invalidateQueries({ queryKey: ["big_paints"] });
  }, [isPending]);

  return (
    <Form action={action} className="space-y-6">
      <div className="flex items-center justify-between p-4">
        <button
          className="max-w-32 overflow-hidden text-ellipsis whitespace-nowrap rounded-full bg-neutral-800 px-3 ring-1 ring-neutral-600 hover:bg-neutral-600 hover:ring-0 active:bg-neutral-700 active:ring-1 disabled:text-neutral-500"
          type="button"
          disabled={isPending}
          onClick={() => {
            router.back();
          }}
        >
          Close
        </button>
        <button
          className="max-w-32 overflow-hidden text-ellipsis whitespace-nowrap rounded bg-blue-500 px-3 ring-1 ring-blue-300 hover:bg-blue-300 hover:ring-0 active:bg-blue-400 active:ring-1 disabled:text-blue-200"
          type="submit"
          disabled={isPending}
        >
          {isPending ? "Saving..." : "Save"}
        </button>
      </div>
      <h1 className="text-lg font-medium">Create BigPaint</h1>
      <input
        className="w-full hyphens-auto break-words rounded bg-neutral-700 p-4"
        type="text"
        placeholder="Name"
        name="name"
        required
      />
    </Form>
  );
}