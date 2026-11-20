import { create } from "zustand";

type ScreenState = {
    // The hero is shown on start and after the logo, whatever the field holds.
    isStart: boolean;
    // The screens are swapping: the caret of the results field is hidden, as iOS would draw it flying over the
    // animation.
    isSwapping: boolean;
};

export const useScreenStore = create<ScreenState>()(() => ({
    isStart: true,
    isSwapping: false,
}));
