"use client";
import { createBigPaintAction } from "@/actions/createBigPaintAction";
import Button from "@/components/Button";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";

export default function BigPaintCreateForm() {
  const router = useRouter();

  const [, action, isPending] = useActionState(createBigPaintAction, void 0);

  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isPending) queryClient.invalidateQueries({ queryKey: ["big_paints"] });
  }, [isPending]);

  return (
    <form action={action} className="space-y-6">
      <div className="flex items-center justify-between p-4">
        <Button
          disabled={isPending}
          onClick={() => {
            router.back();
          }}
        >
          Close
        </Button>
        <Button color="accent" type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Save"}
        </Button>
      </div>
      <h1 className="text-lg font-medium">Create BigPaint</h1>
      <input
        className="w-full hyphens-auto break-words rounded bg-neutral-700 p-4"
        type="text"
        placeholder="Name"
        name="name"
        required
      />
    </form>
  );
}
