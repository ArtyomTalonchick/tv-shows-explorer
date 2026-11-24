import type { ReactNode } from "react";
import { showToast, type ShowToastOptions } from "~/lib/toast/showToast";

type FavoriteToast = {
    // What happened to the show: a change the server made, one it did not, or none, as a guest has no favourites.
    change: "added" | "removed" | "notAdded" | "notRemoved" | "signInFirst";
    name: string;
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

// The toast after a press on a bookmark, with the show's name in bold; a guest's press offers the way to sign
// in.
export const showFavoriteToast = ({ change, name }: FavoriteToast): void => {
    const { text, ...look } = LOOKS[change];

    showToast({ ...look, text: text(<b>{name}</b>) });
};
