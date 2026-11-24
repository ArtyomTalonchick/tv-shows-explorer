import type { ReactNode } from "react";
import { showToast, type ShowToastOptions } from "~/lib/toast/showToast";

type FavoriteToast = {
    // What happened to the show: a change the server made, one it did not, or none, as a guest has no favourites.
    change: "added" | "removed" | "notAdded" | "notRemoved" | "signInFirst";
    name: string;
    // Puts a removed show back.
    onUndo?: () => void;
};

type ToastLook = Pick<ShowToastOptions, "icon" | "tone" | "urgent" | "link"> & {
    text: (name: ReactNode) => ReactNode;
};

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
    signInFirst: {
        icon: "bookmark",
        tone: "muted",
        link: { label: "Sign in", to: "/sign-in" },
        text: (name) => <>Sign in to keep {name} in your favourites</>,
    },
} satisfies Record<FavoriteToast["change"], ToastLook>;

// The toast after a press on a bookmark, with the show's name in bold; a removal offers Undo, and a guest's press
// the way to sign in.
export const showFavoriteToast = ({ change, name, onUndo }: FavoriteToast): void => {
    const { text, ...look } = LOOKS[change];
    const action = onUndo ? { label: "Undo", onClick: onUndo } : undefined;

    showToast({ ...look, text: text(<b>{name}</b>), action });
};
