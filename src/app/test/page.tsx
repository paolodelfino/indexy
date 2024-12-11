"use client";

// import FieldNumber, { fieldNumber } from "@/components/form_ui/FieldNumber";
// import FieldSelect, { fieldSelect } from "@/components/form_ui/FieldSelect";
// import { createForm } from "@/utils/form";
// import { useEffect } from "react";
// import { z } from "zod";

import { notFound } from "next/navigation";

// const useForm = createForm(
//   z.object({ foo: z.number().gt(5) }),
//   {
//     foo: fieldNumber(),
//     bar: fieldSelect({
//       items: [{ content: "afaa", id: "hrh" }],
//       selectedItem: "hrh",
//     }),
//   },
//   {},
// );

export default function Page() {
  notFound();

  // const form = useForm();

  // useEffect(() => {
  //   console.log(form.fields.foo.value);
  // }, [form.fields.foo.value]);

  // return (
  //   <div>
  //     <FieldNumber
  //       error={form.fields.foo.error}
  //       meta={form.fields.foo.meta}
  //       defaultMeta={form.fields.foo.default.meta}
  //       placeholder="hello"
  //       setMeta={form.setMeta.bind(null, "foo")}
  //       setValue={form.setValue.bind(null, "foo")}
  //     />
  //     <FieldSelect
  //       placeholder="aaa"
  //       disabled={false}
  //       acceptIndeterminate
  //       error={form.fields.bar.error}
  //       meta={form.fields.bar.meta}
  //       setMeta={form.setMeta.bind(null, "bar")}
  //       setValue={form.setValue.bind(null, "bar")}
  //     />
  //   </div>
  // );
}
