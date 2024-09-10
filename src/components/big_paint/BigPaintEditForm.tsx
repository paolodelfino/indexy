"use client";
import { deleteBigPaintAction } from "@/actions/deleteBigPaintAction";
import { editBigPaintAction } from "@/actions/editBigPaintAction";
import ModifyRelated from "@/components/ModifyRelated";
import Form from "next/form";
import { useRouter } from "next/navigation";
import { startTransition, useActionState, useEffect, useState } from "react";

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

  const dateTimeFormat = new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    fractionalSecondDigits: 3,
  });
  const [date, setDate] = useState("");

  useEffect(() => {
    const parts = dateTimeFormat.formatToParts(bigPaint.date);

    const year = parts
      .find((part) => part.type === "year")!
      .value.padStart(4, "0");
    const month = parts.find((part) => part.type === "month")!.value;
    const day = parts.find((part) => part.type === "day")!.value;
    const hour = parts.find((part) => part.type === "hour")!.value;
    const minute = parts.find((part) => part.type === "minute")!.value;
    const second = parts.find((part) => part.type === "second")!.value;
    const fractionalSecond = parts.find(
      (part) => part.type === "fractionalSecond",
    )!.value;

    const date = `${year}-${month}-${day}T${hour}:${minute}:${second}.${fractionalSecond}`;

    setDate(date);
  }, [bigPaint.date]);

  useEffect(() => {
    if (state.success) {
      // TODO: Handle differently, for example using a toast
      // console.log(state.data.message);
      // TODO: Until we complete the todo above, we redirect, because there are some problems with the state of the form after the submit
      if (state.data.message !== "") {
        // window.location.reload();
      }
    }
  }, [state]);

  const bind2 = deleteBigPaintAction.bind(null, bigPaint.id);
  const [state2, dispatch2, isPending2] = useActionState(bind2, {
    success: true,
    data: { message: "" },
  });

  useEffect(() => {
    if (state2.success) {
      // TODO: Handle differently, for example using a toast
      // console.log(state2.data.message);
      // TODO: Until we complete the todo above, we redirect, because there are some problems with the state of the form after the submit
      if (state2.data.message !== "") {
        window.location.reload();
      }
    }
  }, [state2]);

  const [name, setName] = useState(bigPaint.name);

  useEffect(() => {
    setName(bigPaint.name);
  }, [bigPaint.name]);

  const router = useRouter();

  if (!state.success) {
    // TODO: Handle differently, for example using a toast
    console.log(state.errors);
    return "Something went wrong. See the console";
  }

  if (!state2.success) {
    // TODO: Handle differently, for example using a toast
    console.log(state2.errors);
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
        <div className="flex gap-4">
          <button
            onClick={() => {
              if (confirm("Are you sure?")) {
                startTransition(() => {
                  dispatch2();
                });
              }
            }}
            disabled={isPending2}
            type="button"
            className="max-w-32 overflow-hidden text-ellipsis whitespace-nowrap rounded bg-red-800 px-3 ring-1 ring-red-600 hover:bg-red-600 hover:ring-0 active:bg-red-700 active:ring-1"
          >
            {isPending2 ? "Deleting..." : "Delete"}
          </button>
          <button
            type="submit"
            className="max-w-32 overflow-hidden text-ellipsis whitespace-nowrap rounded bg-blue-500 px-3 ring-1 ring-blue-300 hover:bg-blue-300 hover:ring-0 active:bg-blue-400 active:ring-1"
            disabled={isPending}
          >
            {isPending ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
      <div>
        <input
          className="w-full hyphens-auto break-words rounded bg-neutral-700 p-4"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
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
      </div>
      <ModifyRelated mode="bigPaint" currentRelated={relatedBigPaints} />
    </Form>
  );
}
