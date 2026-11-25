import type { Show } from "@tv-shows-explorer/shared";
import type { ReactNode } from "react";
import { showToast, type ShowToastOptions, type ToastLink } from "~/lib/toast/showToast";

type FavoriteToast = {
    // What happened to the show: a change the server made, one it did not, or none, as a guest has no favourites.
    change: "added" | "removed" | "notAdded" | "notRemoved" | "signInFirst";
    show: Omit<Show, "rating">;
};

type ToastLook = Pick<ShowToastOptions, "icon" | "tone" | "urgent"> & {
    text: (name: ReactNode) => ReactNode;
    link?: (show: Omit<Show, "rating">) => ToastLink;
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
        // The show goes in the history state of the sign-in page, which adds it once the guest signs in or up.
        link: (show) => ({ label: "Sign in", to: "/sign-in", state: show }),
        text: (name) => <>Sign in to keep {name} in your favourites</>,
    },
} satisfies Record<FavoriteToast["change"], ToastLook>;

// The toast after a press on a bookmark, with the show's name in bold; a guest's press offers the way to sign
// in.
export const showFavoriteToast = ({ change, show }: FavoriteToast): void => {
    const { text, link, ...look }: ToastLook = LOOKS[change];

    showToast({ ...look, text: text(<b>{show.name}</b>), link: link?.(show) });
};
