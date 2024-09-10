"use client";
import { createBigPaintAction } from "@/actions/createBigPaintAction";
import Form from "next/form";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";

export default function BigPaintCreate() {
  const [state, dispatch, isPending] = useActionState(createBigPaintAction, {
    success: true,
    data: { message: "" },
  });

  useEffect(() => {
    if (state.success) {
      // TODO: Handle differently, for example using a toast
      // console.log(state.data.message);
      // TODO: There are some problems with the state of the form after the submit
      if (state.data?.message !== "") {
        window.location.reload();
      }
    }
  }, [state]);

  const router = useRouter();

  if (!state.success) {
    // TODO: Handle differently, for example using a toast
    console.log(state.errors);
    return "Something went wrong. See the console";
  }

  return (
    <Form action={dispatch} className="space-y-6">
      <div className="flex items-center justify-between p-4">
        <button
          type="button"
          onClick={() => {
            router.back();
          }}
          className="max-w-32 overflow-hidden text-ellipsis whitespace-nowrap rounded-full bg-neutral-800 px-3 ring-1 ring-neutral-600 hover:bg-neutral-600 hover:ring-0 active:bg-neutral-700 active:ring-1"
        >
          Close
        </button>
        <button
          type="submit"
          className="max-w-32 overflow-hidden text-ellipsis whitespace-nowrap rounded bg-blue-500 px-3 ring-1 ring-blue-300 hover:bg-blue-300 hover:ring-0 active:bg-blue-400 active:ring-1"
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
