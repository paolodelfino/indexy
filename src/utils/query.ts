import { create } from "zustand";

export interface QueryState<Fn extends (...args: any) => any> {
  data: Awaited<ReturnType<Fn>> | undefined;
  isFresh: boolean;
  isFetching: boolean;
  fn: Fn;
  lastArgs: Parameters<Fn> | undefined;
  isActive: boolean;
  active: () => Promise<void>;
  inactive: () => void;
  fetch: (...args: Parameters<Fn>) => Promise<void>;
  invalidate: () => void;
}

/**
 * Query function must not return undefined because it is a guard value
 */
export default function createQuery<Fn extends (...args: any) => any>(fn: Fn) {
  return create<QueryState<Fn>>((set, get, api) => ({
    data: undefined,
    isFresh: true,
    isFetching: false,
    fn: fn, // TODO: Remove
    lastArgs: undefined,
    isActive: false,
    async active() {
      set({ isActive: true });

      const state = get();

      if (!state.isFresh) await state.fetch(...state.lastArgs!);
    },
    inactive() {
      set({ isActive: false });
    },
    async fetch(...args) {
      const state = get();

      if (!state.isActive) throw new Error("Tried to fetch an inactive query");

      set({ isFetching: true });

      set({
        data: await state.fn(...args),
        isFresh: true,
        lastArgs: args,
        isFetching: false,
      });
    },
    invalidate() {
      const state = get();

      if (state.data === undefined) return;

      if (state.isActive) state.fetch(...state.lastArgs!);
      else set({ isFresh: false });
    },
  }));
}
