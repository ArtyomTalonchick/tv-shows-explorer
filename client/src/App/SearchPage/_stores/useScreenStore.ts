import { create } from "zustand";

type ScreenState = {
    // The hero is shown on start and after the logo, whatever the field holds.
    isStart: boolean;
    // The screens are swapping: the caret of the results field is hidden, as iOS would draw it flying over the
    // animation.
    isSwapping: boolean;
    setIsStart: (isStart: boolean) => void;
    setIsSwapping: (isSwapping: boolean) => void;
};

export const useScreenStore = create<ScreenState>()((set) => ({
    isStart: true,
    isSwapping: false,
    setIsStart: (isStart) => set({ isStart }),
    setIsSwapping: (isSwapping) => set({ isSwapping }),
}));
