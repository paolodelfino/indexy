"use client";

import { ButtonLink } from "@/components/Button";
import { PencilEdit01 } from "@/components/icons";
import { dateToString } from "@/utils/date";
import { Selectable } from "kysely";
import { Query as Query__Type } from "kysely-codegen/dist/db";
import { useMemo } from "react";

export default function Query({
  data,
  id,
}: {
  data: Selectable<Query__Type>;
  id?: string;
}) {
  const date = useMemo(() => dateToString(data.date), [data.date]);

  return (
    <div className="m-px flex flex-col ring-1 ring-neutral-600">
      <ButtonLink
        id={id}
        href={`/result?${data.values}`}
        full
        size="large"
        color="ghost"
        classNames={{ button: "py-5" }}
      >
        {data.name !== null ? data.name : "Untitled"}
      </ButtonLink>
      <div className="flex items-center gap-2 px-3">
        <p className="bg-neutral-600 text-neutral-300">{data.category}</p>
        <p className="grow-0 text-neutral-500">{date}</p>
        <ButtonLink
          href={`/edit/${data.values}?type=query`}
          color="ghost"
          size="large"
        >
          <PencilEdit01 />
        </ButtonLink>
      </div>
    </div>
  );
}
