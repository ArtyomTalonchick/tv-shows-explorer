import type { ReactNode } from "react";
import { useLocation } from "react-router";

export type AuthPageProps = {
    eyebrow: string;
    title: string;
    text: string;
    // The form of the page.
    children?: ReactNode;
    // The line under the card that leads to the other page: «No account yet? Sign up».
    footer: { text: string; link: string; to: string };
};

type UsePresenterResult = Omit<AuthPageProps, "footer"> & {
    // The footer's link carries the page's history state on, so the show a guest bookmarked goes with them from the
    // sign-in to the sign-up.
    footer: AuthPageProps["footer"] & { state: unknown };
};

export const usePresenter = ({ footer, ...page }: AuthPageProps): UsePresenterResult => {
    const { state } = useLocation();

    return { ...page, footer: { ...footer, state } };
};
