"use client";
import { createInspirationAction } from "@/actions/createInspirationAction";
import Form from "next/form";
import { useActionState, useEffect } from "react";
import TextArea from "react-textarea-autosize";

export default function Page() {
  const [state, dispatch, isPending] = useActionState(createInspirationAction, {
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

  if (!state.success) {
    // TODO: Handle differently, for example using a toast
    console.log(state.errors);
    return "Something went wrong. See the console";
  }

  return (
    <Form action={dispatch}>
      <div className="flex items-center justify-between p-4">
        <button
          type="button"
          onClick={() => {
            window.close();
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
      <TextArea
        className="-mb-[7px] w-full hyphens-auto break-words rounded bg-neutral-700 p-4"
        placeholder="Content"
        name="content"
        required
      />
    </Form>
  );
}
