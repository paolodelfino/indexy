"use client";
import Button from "@/components/Button";
import { Cloud, InformationCircle } from "@/components/icons";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/popover";
import { cn } from "@/utils/cn";
import { FormField } from "@/utils/form";
import { useEffect } from "react";

// TODO: Think of custom styling

type Item = {
  content: string;
  id: string;
};

type Meta = {
  items: Item[];
  selectedItem: Item;
};

type Value = string | undefined;

export type FieldSelect__Type = FormField<Value, Meta>;

export const indeterminateGuard: Item = { content: "", id: "" };

function isIndeterminateGuard(item: Item): boolean {
  return (
    item.content === indeterminateGuard.content &&
    item.id === indeterminateGuard.id
  );
}

// We use undefined as the guard value assuming that undefined is equivalent to indeterminate state and nothing else for any field
export function fieldSelect(
  meta: Partial<Pick<Meta, "selectedItem">> & Pick<Meta, "items">,
): FieldSelect__Type {
  if (meta.items.length <= 0) throw new Error("No items to select");
  return {
    meta: {
      selectedItem: indeterminateGuard,
      ...meta,
    },
    value: undefined,
    default: {
      meta: {
        selectedItem: indeterminateGuard,
        ...meta,
      },
      value: undefined,
    },
    error: undefined,
  };
}

export default function FieldSelect({
  meta,
  setMeta,
  setValue,
  error,
  disabled,
  acceptIndeterminate,
  placeholder,
}: {
  acceptIndeterminate?: boolean;
  setValue: (value: Value) => void;
  meta: Meta;
  setMeta: (meta: Partial<Meta>) => void;
  error: string | undefined;
  disabled: boolean;
  placeholder: string;
}) {
  useEffect(() => {
    setValue(
      acceptIndeterminate && isIndeterminateGuard(meta.selectedItem)
        ? undefined
        : meta.selectedItem.id,
    );
  }, [meta.selectedItem]);

  useEffect(() => {
    if (meta.items.length <= 0) throw new Error("No items to select");
  }, [meta.items]);

  return (
    <div className="flex gap-1">
      <Popover>
        <PopoverTrigger
          disabled={disabled}
          title={placeholder}
          classNames={{
            button: cn(
              isIndeterminateGuard(meta.selectedItem) &&
                "text-neutral-400 bg-neutral-700",
            ),
          }}
        >
          {isIndeterminateGuard(meta.selectedItem)
            ? placeholder
            : meta.selectedItem.content}
        </PopoverTrigger>
        <PopoverContent>
          <List meta={meta} setMeta={setMeta} disabled={disabled} />
        </PopoverContent>
      </Popover>

      {error !== undefined && (
        <Popover>
          <PopoverTrigger color="danger" disabled={disabled}>
            <InformationCircle />
          </PopoverTrigger>
          <PopoverContent className="rounded border bg-neutral-700 p-4 italic">
            {error}
          </PopoverContent>
        </Popover>
      )}

      {acceptIndeterminate === true &&
        !isIndeterminateGuard(meta.selectedItem) && (
          <Button
            aria-label="Clear"
            disabled={disabled}
            color="ghost"
            onClick={() =>
              setMeta({
                selectedItem: indeterminateGuard,
              })
            }
          >
            <Cloud />
          </Button>
        )}
    </div>
  );
}

function List({
  meta,
  setMeta,
  disabled,
}: {
  meta: Meta;
  setMeta: (meta: Partial<Meta>) => void;
  disabled: boolean;
}) {
  return (
    <ul className="flex w-full flex-col">
      {meta.items.map((it) => (
        <ListItem key={it.id} data={it} setMeta={setMeta} disabled={disabled} />
      ))}
    </ul>
  );
}

function ListItem({
  setMeta,
  data,
  disabled,
}: {
  setMeta: (meta: Partial<Meta>) => void;
  disabled: boolean;
  data: Item;
}) {
  return (
    <Button
      size="large"
      full
      multiple
      disabled={disabled}
      onClick={() =>
        setMeta({
          selectedItem: data,
        })
      }
    >
      {data.content}
    </Button>
  );
}
