import { chakra } from "@chakra-ui/react";
import type { FC } from "react";
import { usePresenter } from "./_logic/usePresenter";

// The drawer's title: «Favourites» and the number of them in a lighter colour, which a guest does not have.
export const FavoritesTitle: FC = () => {
    const { hasCount, count } = usePresenter();

    if (!hasCount) {
        return "Favourites";
    }

    return (
        <>
            Favourites{" "}
            <chakra.span color="fg.subtle" fontWeight="semibold">
                {count}
            </chakra.span>
        </>
    );
};
