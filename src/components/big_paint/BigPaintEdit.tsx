"use client";
import { editBigPaintAction } from "@/actions/editBigPaintAction";
import ModifyRelated from "@/components/ModifyRelated";
import Form from "next/form";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";

export default function BigPaintEdit({
  data: { bigPaint, relatedBigPaints },
}: {
  data: {
    bigPaint: {
      name: string;
      date: Date;
      id: string;
    };
    relatedBigPaints: { id: string; name: string }[];
  };
}) {
  const bind = editBigPaintAction.bind(null, bigPaint.id);
  const [state, dispatch, isPending] = useActionState(bind, {
    success: true,
    data: { message: "" },
  });

  const date =
    String(bigPaint.date.getUTCFullYear()).padStart(4, "0") +
    "-" +
    String(bigPaint.date.getUTCMonth() + 1).padStart(2, "0") +
    "-" +
    String(bigPaint.date.getUTCDate()).padStart(2, "0") +
    "T" +
    String(bigPaint.date.getUTCHours()).padStart(2, "0") +
    ":" +
    String(bigPaint.date.getUTCMinutes()).padStart(2, "0") +
    ":" +
    String(bigPaint.date.getUTCSeconds()).padStart(2, "0");

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      // TODO: Handle differently, for example using a toast
      // console.log(state.data.message);
      // TODO: Until we complete the todo above, we redirect, because there are some problems with the state of the form after the submit
      if (state.data.message !== "") {
        router.refresh();
      }
    }
  }, [state]);

  if (!state.success) {
    // TODO: Handle differently, for example using a toast
    console.log(state.errors);
    return "Something went wrong. See the console";
  }

  return (
    <Form action={dispatch}>
      <div className="flex items-center justify-between p-4">
        <button
          onClick={() => {
            window.close();
          }}
          className="max-w-32 overflow-hidden text-ellipsis whitespace-nowrap rounded-full bg-neutral-800 px-3 ring-1 ring-neutral-600 hover:bg-neutral-600 hover:ring-0 active:bg-neutral-700 active:ring-1"
        >
          Close
        </button>
        <button
          type="submit"
          className="rounded bg-blue-500 px-3 ring-1 ring-blue-300 disabled:text-neutral-500 [&:not(:disabled):active]:bg-blue-400 [&:not(:disabled):active]:ring-1 [&:not(:disabled):hover]:bg-blue-300 [&:not(:disabled):hover]:ring-0"
          disabled={isPending}
        >
          {isPending ? "Saving..." : "Save"}
        </button>
      </div>
      <input
        className="w-full hyphens-auto break-words rounded bg-neutral-700 p-4"
        placeholder="Name"
        defaultValue={bigPaint.name}
        name="name"
        required
        type="text"
        onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
      />
      <div className="flex min-h-9 items-center justify-end pr-2">
        <input
          type="datetime-local"
          name="date"
          required
          defaultValue={date}
          step="1"
          className="bg-black text-neutral-500 [&::-webkit-calendar-picker-indicator]:-ml-6"
        />
      </div>
      <ModifyRelated mode="bigPaint" currentRelated={relatedBigPaints} />
    </Form>
  );
}
