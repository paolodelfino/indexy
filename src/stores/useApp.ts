import { create } from "zustand";

interface State {
  mode: "idle" | "edit";
  changeMode: (
    value: ((prev: State["mode"]) => State["mode"]) | State["mode"],
  ) => void;

  isEditAvailable: boolean;
  makeEditAvailable: (value: boolean) => void;
}

export const useApp = create<State>((set) => ({
  mode: "idle",
  changeMode(value) {
    set((state) => ({
      ...state,
      mode: typeof value === "function" ? value(state.mode) : value,
    }));
  },

  isEditAvailable: false,
  makeEditAvailable(value) {
    set((state) => ({ ...state, isEditAvailable: value }));
  },
}));
