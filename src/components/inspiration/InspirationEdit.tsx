"use client";
import { editInspirationAction } from "@/actions/editInspirationAction";
import { Star } from "@/components/icons";
import ModifyRelated from "@/components/ModifyRelated";
import { cn } from "@/utils/cn";
import Form from "next/form";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import TextArea from "react-textarea-autosize";

export default function InspirationEdit({
  data: { inspiration, relatedBigPaints, relatedInspirations },
}: {
  data: {
    inspiration: {
      content: string;
      date: Date;
      highlight: boolean;
      id: string;
    };
    relatedBigPaints: { id: string; name: string }[];
    relatedInspirations: { id: string; name: string }[];
  };
}) {
  const bind = editInspirationAction.bind(null, inspiration.id);
  const [state, dispatch, isPending] = useActionState(bind, {
    success: true,
    data: { message: "" },
  });

  const date =
    String(inspiration.date.getUTCFullYear()).padStart(4, "0") +
    "-" +
    String(inspiration.date.getUTCMonth() + 1).padStart(2, "0") +
    "-" +
    String(inspiration.date.getUTCDate()).padStart(2, "0") +
    "T" +
    String(inspiration.date.getUTCHours()).padStart(2, "0") +
    ":" +
    String(inspiration.date.getUTCMinutes()).padStart(2, "0") +
    ":" +
    String(inspiration.date.getUTCSeconds()).padStart(2, "0");

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      // TODO: Handle differently, for example using a toast
      // console.log(state.data.message);
      // TODO: There are some problems with the state of the form after the submit
      if (state.data.message !== "") {
        window.location.reload();
      }
    }
  }, [state]);

  const [highlight, setHighlight] = useState(inspiration.highlight);

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
      <TextArea
        className="-mb-[7px] w-full hyphens-auto break-words rounded bg-neutral-700 p-4"
        placeholder="Content"
        defaultValue={inspiration.content}
        name="content"
        required
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
        <input
          type="checkbox"
          name="highlight"
          checked={highlight}
          className="hidden"
          readOnly
        />
        <button
          type="button"
          aria-label="Toggle highlight"
          className="pl-4 text-neutral-300"
          onClick={() => setHighlight((prev) => !prev)}
        >
          <Star className={cn(highlight && "fill-current")} />
        </button>
      </div>
      <ModifyRelated mode="bigPaint" currentRelated={relatedBigPaints} />
      <ModifyRelated mode="inspiration" currentRelated={relatedInspirations} />
    </Form>
  );
}
