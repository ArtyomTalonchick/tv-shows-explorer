import { chakra } from "@chakra-ui/react";
import type { FC } from "react";
import { usePresenter } from "./_logic/usePresenter";

// The drawer's title: «Favourites» and the number of them in a lighter colour.
export const FavoritesTitle: FC = () => {
    const { count } = usePresenter();

    return (
        <>
            Favourites{" "}
            <chakra.span color="fg.subtle" fontWeight="semibold">
                {count}
            </chakra.span>
        </>
    );
};
