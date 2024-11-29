"use client";

import ActionDelete__Query from "@/actions/ActionDelete__Query";
import Button, { ButtonLink } from "@/components/Button";
import { Delete01, PencilEdit01 } from "@/components/icons";
import useQueryQuery__Query from "@/stores/queries/useQueryQuery__Query";
import useQueryQuery__View from "@/stores/queries/useQueryQuery__View";
import { dateToString } from "@/utils/date";
import { Selectable } from "kysely";
import { Query } from "kysely-codegen/dist/db";
import { useMemo, useState } from "react";

export default function UIQuery({
  data,
  id,
}: {
  data: Selectable<Query>;
  id?: string;
}) {
  const date = useMemo(() => dateToString(data.date), [data.date]);

  const [isDeleteFormPending, setIsDeleteFormPending] = useState(false);

  const invalidateQueryQueries__View = useQueryQuery__View(
    (state) => state.invalidate,
  );
  const invalidateQueryQueries__Search = useQueryQuery__Query(
    (state) => state.invalidate,
  );

  return (
    <div className="m-px flex flex-col ring-1 ring-neutral-600">
      <ButtonLink
        id={id}
        href={`/query/${data.category}/${data.values}`}
        full
        size="large"
        color="ghost"
        classNames={{ button: "py-5" }}
        disabled={isDeleteFormPending}
      >
        {data.name !== null ? data.name : "Untitled"}
      </ButtonLink>
      <div className="flex items-center gap-2 px-3">
        <p className="bg-neutral-600 text-neutral-300">{data.category}</p>
        <p className="grow-0 text-neutral-500">{date}</p>
        <ButtonLink
          href={`/edit/query/${data.values}`}
          color="ghost"
          size="large"
          disabled={isDeleteFormPending}
        >
          <PencilEdit01 />
        </ButtonLink>
        <Button
          color="danger"
          disabled={isDeleteFormPending}
          onClick={async () => {
            if (confirm("Are you sure?")) {
              setIsDeleteFormPending(true);

              await ActionDelete__Query({
                values: data.values,
              });
              invalidateQueryQueries__View();
              invalidateQueryQueries__Search();

              setIsDeleteFormPending(false);
            }
          }}
        >
          <Delete01 />
        </Button>
      </div>
    </div>
  );
}
