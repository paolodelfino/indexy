import { create } from "zustand";

interface State {
  isEmpty: boolean;
  setIsEmpty: (isEmpty: boolean) => void;
  mode: "idle" | "edit";
  changeMode: (
    value: ((prev: State["mode"]) => State["mode"]) | State["mode"],
  ) => void;
}

export const useApp = create<State>((set) => ({
  isEmpty: true,
  setIsEmpty(isEmpty) {
    set((state) => ({ ...state, isEmpty }));
  },
  mode: "idle",
  changeMode(value) {
    set((state) => ({
      ...state,
      mode: typeof value === "function" ? value(state.mode) : value,
    }));
  },
}));
