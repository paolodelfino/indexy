"use client";

import Button, { ButtonLink } from "@/components/Button";
import { useEffect, useRef, useState } from "react";

// TODO: Se l'hook funziona, allora togli da mezzo mantine
function useInView<T extends HTMLElement>(
  callback: (isIntersecting: boolean, target: Element) => void,
) {
  const ref = useRef<T>(null);
  const observer = useRef<IntersectionObserver>(undefined);

  useEffect(() => {
    if (observer.current === undefined) {
      console.log("setting observer");
      observer.current = new IntersectionObserver((entries, observer) => {
        console.log(entries[0].target, entries[0].isIntersecting);
        callback(entries[0].isIntersecting, entries[0].target);
      });
    } else console.log("not setting observer because we already have one");
  }, []);

  useEffect(() => {
    console.log("ref changed", ref.current);

    if (observer.current === undefined)
      throw new Error("No observer available");

    console.log("disconnecting observer");
    observer.current.disconnect();

    if (ref.current === null) console.log("ref is null");
    else {
      console.log("connecting observer");
      observer.current.observe(ref.current);
    }
  }, [ref.current]);

  return { ref };
}

export default function Example() {
  const { ref } = useInView<HTMLButtonElement>();

  const [index, setIndex] = useState(true);

  return (
    <div>
      <div className="sticky top-0 flex gap-2 bg-black">
        <Button onClick={() => setIndex((state) => !state)}>Change ref</Button>
        <ButtonLink href="/test2">Go other page test</ButtonLink>
      </div>
      <div className="h-[1300px] w-full bg-yellow-500"></div>
      <Button ref={index === true ? ref : undefined}>hi</Button>
      <div className="h-[1300px] w-full bg-blue-500"></div>
      <Button ref={index === false ? ref : undefined}>hi2</Button>
    </div>
  );
}
