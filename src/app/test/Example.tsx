"use client";

import Button, { ButtonLink } from "@/components/Button";
import FieldText from "@/components/form_ui/FieldText";
import { useState } from "react";

export default function Example() {
  const [meta, setMeta] = useState("");
  const [value, setValue] = useState("");

  return (
    <div>
      <FieldText
        disabled={false}
        error={undefined}
        meta={meta}
        setMeta={setMeta}
        // @ts-expect-error
        setValue={setValue}
      />
      <p>{`/test/${value}`}</p>
      <ButtonLink href={`/test/${value}`}>send</ButtonLink>
    </div>
  );
}
