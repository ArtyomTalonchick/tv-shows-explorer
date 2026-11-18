import { create } from "zustand";

type QueryState = {
    // What the search field holds, as typed: the hero's field and the results screen's field are one field.
    value: string;
    setValue: (value: string) => void;
    clear: () => void;
};

export const useQueryStore = create<QueryState>()((set) => ({
    value: "",
    setValue: (value) => set({ value }),
    clear: () => set({ value: "" }),
}));
