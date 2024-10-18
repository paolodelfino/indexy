"use client";
import { createInspirationAction } from "@/actions/createInspirationAction";
import Button from "@/components/Button";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import TextArea from "react-textarea-autosize";

export default function InspirationCreateForm() {
  const router = useRouter();

  const [, action, isPending] = useActionState(createInspirationAction, void 0);

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
      <h1 className="text-lg font-medium">Create Inspiration</h1>
      <TextArea
        className="-mb-[7px] w-full hyphens-auto break-words rounded bg-neutral-700 p-4"
        placeholder="Content"
        name="content"
        required
      />
    </form>
  );
}
