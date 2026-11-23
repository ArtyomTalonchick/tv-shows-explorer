import type { FC } from "react";
import { Navigate, Route, Routes } from "react-router";
import { Toaster } from "~/lib/ui-kit/Toaster/Toaster";
import { FavoritesDrawer } from "./FavoritesDrawer/FavoritesDrawer";
import { SearchPage } from "./SearchPage/SearchPage";
import { SignInPage } from "./SignInPage/SignInPage";
import { SignUpPage } from "./SignUpPage/SignUpPage";
import { usePresenter } from "./_logic/usePresenter";

// The page of the address, and what floats above it on every page: the favourites list and the toasts. An unknown
// address is replaced by the search.
export const App: FC = () => {
    usePresenter();

    return (
        <>
            <Routes>
                <Route path="/" element={<SearchPage />} />
                <Route path="/sign-in" element={<SignInPage />} />
                <Route path="/sign-up" element={<SignUpPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <FavoritesDrawer />
            <Toaster />
        </>
    );
};
