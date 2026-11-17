import type { ReactNode } from "react";
import { showToast, type ShowToastOptions } from "@/lib/toast/showToast";

type FavoriteToast = {
    // What happened to the show: a change the server made, or one it did not.
    change: "added" | "removed" | "notAdded" | "notRemoved";
    name: string;
    // Puts a removed show back.
    onUndo?: () => void;
};

type ToastLook = Pick<ShowToastOptions, "icon" | "tone" | "urgent"> & { text: (name: ReactNode) => ReactNode };

const LOOKS = {
    added: { icon: "bookmark", tone: "accent", text: (name) => <>Added {name} to favourites</> },
    removed: { icon: "bookmark", tone: "muted", text: (name) => <>Removed {name} from favourites</> },
    notAdded: { icon: "alert", tone: "accent", urgent: true, text: (name) => <>Couldn’t add {name} to favourites</> },
    notRemoved: {
        icon: "alert",
        tone: "accent",
        urgent: true,
        text: (name) => <>Couldn’t remove {name} from favourites</>,
    },
} satisfies Record<FavoriteToast["change"], ToastLook>;

// The toast after a press on a bookmark, with the show's name in bold; a removal offers Undo.
export const showFavoriteToast = ({ change, name, onUndo }: FavoriteToast): void => {
    const { text, ...look } = LOOKS[change];
    const action = onUndo ? { label: "Undo", onClick: onUndo } : undefined;

    showToast({ ...look, text: text(<b>{name}</b>), action });
};
