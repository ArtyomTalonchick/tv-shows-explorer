import type { ReactNode } from "react";
import { getToastGroup } from "~/lib/toast/getToastGroup";

// What stays pressable outside the open drawer: the toasts, with their Undo.
const PERSISTENT_ELEMENTS = [getToastGroup];

export type DrawerProps = {
    open: boolean;
    // The backdrop, × and Escape all close it.
    onClose: () => void;
    // The small line above the title, e.g. «Your list».
    eyebrow: string;
    // The caller's own markup inside the title's type, e.g. a name with a count after it.
    title: ReactNode;
    // The label of × for screen readers, e.g. «Close favourites».
    closeLabel: string;
    children: ReactNode;
};

type UsePresenterResult = Omit<DrawerProps, "onClose"> & {
    onOpenChange: (details: { open: boolean }) => void;
    persistentElements: (() => HTMLElement | null)[];
};

export const usePresenter = ({ onClose, ...rest }: DrawerProps): UsePresenterResult => {
    const onOpenChange = ({ open }: { open: boolean }): void => {
        if (!open) {
            onClose();
        }
    };

    return { ...rest, onOpenChange, persistentElements: PERSISTENT_ELEMENTS };
};
