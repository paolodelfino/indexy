"use client";
import React, { ReactNode, useRef } from "react";

// TODO: Il contenuto viene renderizzato fin da subito
export function Dialog({
  trigger,
  content,
  className,
}: {
  trigger: (dialog: { open(): void; close(): void }) => ReactNode;
  content: (dialog: { open(): void; close(): void }) => ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const open = () => ref.current!.showModal();
  const close = () => ref.current!.close();
  return (
    <React.Fragment>
      {trigger({ open, close })}
      <dialog className={className} ref={ref}>
        {content({ open, close })}
      </dialog>
    </React.Fragment>
  );
}
