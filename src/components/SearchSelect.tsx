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

const searchSelect = tv({
  slots: {
    error: "",
    base: "space-y-6 px-3 py-5 7xl:px-0",
    titleBase: "group flex items-center",
    titleH2: "text-lg font-medium",
    titleButton: "opacity-0 transition-opacity group-hover:opacity-100",
    titleIcon: "",
    selectedBase: "flex flex-wrap gap-1.5",
    selectedItem:
      "max-w-32 overflow-hidden text-ellipsis hyphens-auto whitespace-nowrap break-words rounded-full bg-neutral-800 px-3 text-start ring-1 ring-neutral-600 disabled:text-neutral-500 [&:not(:disabled):active]:!bg-neutral-700 [&:not(:disabled):active]:!ring-1 [&:not(:disabled):hover]:bg-neutral-600 [&:not(:disabled):hover]:ring-0",
    searchBase: "",
    searchInput: "h-10 w-full rounded-none px-2",
    searchResultList: "",
    searchResultEmpty: "",
    searchResultLoading: "",
    searchResultItem:
      "w-full hyphens-auto break-words bg-neutral-800 p-2 px-2 text-start ring-1 ring-neutral-600 disabled:text-neutral-500 [&:not(:disabled):active]:!bg-neutral-700 [&:not(:disabled):active]:!ring-1 [&:not(:disabled):hover]:bg-neutral-600 [&:not(:disabled):hover]:ring-0",
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

// TODO: Support accept indeterminate
export function SearchSelect<Display, Output extends Array<any> | undefined>({
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
  blacklist, // TODO: Exclude from search database query
}: ComponentProps<SearchSelectSlots> &
  FormFieldProps<Output> & {
    defaultValue: Display[];
    title: string;
    selectId: (value: Display) => NonNullable<Output>[number];
    selectContent: (value: Display) => ReactNode;
    blacklist?: Display[];
    searchAction: (
      prevState: unknown,
      values: { query: string },
    ) => Promise<Display[]>;
  }) {
  const style = searchSelect();

  const error = useValidationError(
    value,
    validation,
    formPushError,
    formPopError,
  );

  const [showResults, setShowResults] = useState(false);

  const [selected, setSelected] = useState<Display[]>(defaultValue);

  useEffect(() => {
    setSelected(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    // @ts-expect-error
    setValue(selected.map(selectId));
  }, [selected]);

  const [searchResult, searchAction, isSearching] = useActionState(
    _searchAction,
    void 0,
  );

  if (error)
    return (
      <span className={style.error({ className: classNames?.error })}>
        {error}
      </span>
    );

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
      <div className={style.base({ className: classNames?.base })}>
        <Title classNames={classNames} />
        {selected.length > 0 && <SelectedState classNames={classNames} />}
        <div
          className={style.searchBase({ className: classNames?.searchBase })}
        >
          <Search classNames={classNames} />
          {showResults && <SearchResult classNames={classNames} />}
        </div>
      </div>
    </SearchSelectContext.Provider>
  );
}

function Title({ classNames }: ComponentProps<SearchSelectSlots>) {
  const style = searchSelect();

  const context = useContext(SearchSelectContext);

  return (
    <div className={style.titleBase({ className: classNames?.titleBase })}>
      <h2 className={style.titleH2({ className: classNames?.titleH2 })}>
        {context.title}
      </h2>
      <button
        type="button"
        disabled={context.disabled}
        onClick={() => context.setShowResults((curr) => !curr)}
        className={style.titleButton({ className: classNames?.titleButton })}
      >
        <ArrowDown01
          className={style.titleIcon({ className: classNames?.titleIcon })}
          style={{
            transform: `rotate(${context.showResults ? 0 : 270}deg)`,
          }}
        />
      </button>
    </div>
  );
}

function SelectedState({ classNames }: ComponentProps<SearchSelectSlots>) {
  const style = searchSelect();

  const context = useContext(SearchSelectContext);

  return (
    <div
      className={style.selectedBase({ className: classNames?.selectedBase })}
      role="list"
      aria-label={`List of selected ${context.title}`}
    >
      {context.selected.map((it) => (
        <SelectedItem
          classNames={classNames}
          key={context.selectId(it)}
          data={it}
        />
      ))}
    </div>
  );
}

function SelectedItem({
  classNames,
  data,
}: ComponentProps<SearchSelectSlots> & { data: any }) {
  const style = searchSelect();

  const context = useContext(SearchSelectContext);

  const id = context.selectId(data);

  return (
    <button
      role="listitem"
      type="button"
      title={context.selectContent(data)}
      disabled={context.disabled}
      className={style.selectedItem({ className: classNames?.selectedItem })}
      onClick={() =>
        context.setSelected((selected) => selected.filter((it) => it.id !== id))
      }
    >
      {context.selectContent(data)}
    </button>
  );
}

function Search<T>({ classNames }: ComponentProps<SearchSelectSlots>) {
  const style = searchSelect();

  const context = useContext(SearchSelectContext);

  return (
    <input
      type="search"
      className={style.searchInput({ className: classNames?.searchInput })}
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

function SearchResult<T>({ classNames }: ComponentProps<SearchSelectSlots>) {
  const style = searchSelect();

  const context = useContext(SearchSelectContext);

  return (
    <React.Fragment>
      {(context.searchResult?.length || 0) > 0 && !context.isSearching && (
        <ul
          className={style.searchResultList({
            className: classNames?.searchResultList,
          })}
        >
          {context.searchResult!.map((it) => (
            <SearchResultItem
              classNames={classNames}
              key={context.selectId(it)}
              data={it}
            />
          ))}
        </ul>
      )}
      {context.searchResult?.length === 0 && !context.isSearching && (
        <span
          className={style.searchResultEmpty({
            className: classNames?.searchResultEmpty,
          })}
        >
          empty
        </span>
      )}
      {context.isSearching && (
        <span
          className={style.searchResultLoading({
            className: classNames?.searchResultLoading,
          })}
        >
          loading
        </span>
      )}
    </React.Fragment>
  );
}

function SearchResultItem({
  data,
  classNames,
}: ComponentProps<SearchSelectSlots> & { data: any }) {
  const style = searchSelect();

  const context = useContext(SearchSelectContext);

  const id = context.selectId(data);

  return (
    <button
      role="listitem"
      className={style.searchResultItem({
        className: classNames?.searchResultItem,
      })}
      type="button"
      disabled={
        context.selected.findIndex((it) => context.selectId(it) === id) !==
          -1 ||
        (context.blacklist !== undefined &&
          context.blacklist.findIndex((it) => id === context.selectId(it)) !==
            -1) ||
        context.disabled
      }
      onClick={() =>
        context.setSelected((selected) => {
          return [...selected, data];
        })
      }
    >
      {context.selectContent(data)}
    </button>
  );
}
