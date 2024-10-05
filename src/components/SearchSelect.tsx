"use client";
import { ArrowDown01 } from "@/components/icons";
import { useValidationError } from "@/hooks/useValidationError";
import { ComponentProps } from "@/utils/component";
import { FormFieldProps } from "@/utils/form";
import React, {
  createContext,
  ReactNode,
  startTransition,
  useActionState,
  useContext,
  useEffect,
  useState,
} from "react";
import { tv } from "tailwind-variants";

// TODO: Make styles
const searchSelect = tv({
  slots: {
    input: "w-full hyphens-auto break-words rounded bg-neutral-700 p-4",
  },
});

type SearchSelectSlots = keyof ReturnType<typeof searchSelect>;

// @ts-expect-error
const SearchSelectContext = createContext<{
  title: string;
  showResults: boolean;
  setShowResults: (value: boolean | ((curr: boolean) => boolean)) => void;
  selected: any[];
  setSelected: (value: any[] | ((curr: any[]) => any[])) => void;
  selectId: (value: any) => any;
  selectContent: (value: any) => any;
  searchResult: any[] | undefined;
  searchAction: (values: { query: string }) => void;
  isSearching: boolean;
  disabled: boolean;
  blacklist?: any[];
}>();

export function SearchSelect<T, U>({
  classNames,
  value,
  setValue,
  validation,
  formPushError,
  formPopError,
  title,
  defaultValue,
  searchAction: _searchAction,
  selectId,
  selectContent,
  disabled,
  blacklist,
}: ComponentProps<SearchSelectSlots> &
  FormFieldProps<U[]> & {
    defaultValue: T[];
    title: string;
    selectId: (value: T) => U;
    selectContent: (value: T) => ReactNode;
    blacklist?: T[];
    searchAction: (
      prevState: unknown,
      values: { query: string },
    ) => Promise<T[]>;
  }) {
  const { input } = searchSelect(classNames);

  const error = useValidationError(
    value,
    validation,
    formPushError,
    formPopError,
  );

  const [showResults, setShowResults] = useState(false);

  const [selected, setSelected] = useState<T[]>(defaultValue);

  useEffect(() => {
    setSelected(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    setValue(selected.map(selectId));
  }, [selected]);

  const [searchResult, searchAction, isSearching] = useActionState(
    _searchAction,
    void 0,
  );

  if (error) return <span>{error}</span>;

  return (
    <SearchSelectContext.Provider
      value={{
        title,
        selected,
        setSelected,
        setShowResults,
        showResults,
        selectId,
        selectContent,
        searchResult,
        searchAction,
        isSearching,
        disabled,
        blacklist,
      }}
    >
      <div className="space-y-6 px-3 py-5 7xl:px-0">
        <Title />
        <SelectedState />
        <div>
          <Search />
          {showResults && <SearchResults />}
        </div>
      </div>
    </SearchSelectContext.Provider>
  );
}

function Title() {
  const context = useContext(SearchSelectContext);

  return (
    <div className="group flex items-center">
      <h2 className="text-lg font-medium">{context.title}</h2>
      <button
        type="button"
        disabled={context.disabled}
        onClick={() => context.setShowResults((curr) => !curr)}
        className="opacity-0 transition-opacity group-hover:opacity-100"
      >
        <ArrowDown01
          style={{
            transform: `rotate(${context.showResults ? 0 : 270}deg)`,
          }}
        />
      </button>
    </div>
  );
}

function SelectedState() {
  const context = useContext(SearchSelectContext);

  return (
    <div
      className="flex flex-wrap gap-1.5"
      role="list"
      aria-label={`List of selected ${context.title}`}
    >
      {context.selected.map((it) => {
        const id = context.selectId(it);

        return (
          <button
            role="listitem"
            type="button"
            key={context.selectId(it)}
            title={context.selectContent(it)}
            disabled={context.disabled}
            className="max-w-32 overflow-hidden text-ellipsis hyphens-auto whitespace-nowrap break-words rounded-full bg-neutral-800 px-3 text-start ring-1 ring-neutral-600 disabled:text-neutral-500 [&:not(:disabled):active]:!bg-neutral-700 [&:not(:disabled):active]:!ring-1 [&:not(:disabled):hover]:bg-neutral-600 [&:not(:disabled):hover]:ring-0"
            onClick={() =>
              context.setSelected((selected) =>
                selected.filter((it) => it.id !== id),
              )
            }
          >
            {context.selectContent(it)}
          </button>
        );
      })}
    </div>
  );
}

function Search<T>() {
  const context = useContext(SearchSelectContext);

  return (
    <input
      type="search"
      className="h-10 w-full rounded-none px-2"
      required
      disabled={context.isSearching || context.disabled}
      form="unexisting"
      name={`Search input for ${context.title}`}
      onKeyDown={(e) => {
        if (e.code === "Enter" && e.currentTarget.value.trim().length > 0) {
          context.setShowResults(true);
          startTransition(() => {
            context.searchAction({ query: e.currentTarget.value });
          });
        }
      }}
    />
  );
}

function SearchResults<T>() {
  const context = useContext(SearchSelectContext);

  return (
    <React.Fragment>
      {(context.searchResult?.length || 0) > 0 && !context.isSearching && (
        <ul>
          {context.searchResult!.map((it) => {
            const id = context.selectId(it);

            return (
              <button
                role="listitem"
                key={id}
                className="w-full hyphens-auto break-words bg-neutral-800 p-2 px-2 text-start ring-1 ring-neutral-600 disabled:text-neutral-500 [&:not(:disabled):active]:!bg-neutral-700 [&:not(:disabled):active]:!ring-1 [&:not(:disabled):hover]:bg-neutral-600 [&:not(:disabled):hover]:ring-0"
                type="button"
                disabled={
                  context.selected.findIndex(
                    (it) => context.selectId(it) === id,
                  ) !== -1 ||
                  context.blacklist?.findIndex(
                    (it) => id === context.selectId(it),
                  ) !== -1 ||
                  context.disabled
                }
                onClick={() =>
                  context.setSelected((selected) => {
                    return [...selected, it];
                  })
                }
              >
                {context.selectContent(it)}
              </button>
            );
          })}
        </ul>
      )}
      {context.searchResult?.length === 0 && !context.isSearching && (
        <span>empty</span>
      )}
      {context.isSearching && <span>loading</span>}
    </React.Fragment>
  );
}
