import type { FC } from "react";
import { Toaster } from "@/lib/components/Toaster/Toaster";
import { SearchPage } from "./SearchPage/SearchPage";
import { usePresenter } from "./_logic/usePresenter";

// The page, and what floats above it on every screen: the toasts.
export const App: FC = () => {
    usePresenter();

    return (
        <>
            <SearchPage />
            <Toaster />
        </>
    );
};
