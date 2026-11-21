import type { FC } from "react";
import { Toaster } from "~/lib/ui-kit/Toaster/Toaster";
import { FavoritesDrawer } from "./FavoritesDrawer/FavoritesDrawer";
import { SearchPage } from "./SearchPage/SearchPage";
import { usePresenter } from "./_logic/usePresenter";

// The page, and what floats above it on every screen: the favourites list and the toasts.
export const App: FC = () => {
    usePresenter();

    return (
        <>
            <SearchPage />
            <FavoritesDrawer />
            <Toaster />
        </>
    );
};
