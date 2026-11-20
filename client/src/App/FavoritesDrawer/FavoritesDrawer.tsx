import type { FC } from "react";
import { Drawer } from "@/lib/components/Drawer/Drawer";
import { FavoritesEmpty } from "./FavoritesEmpty/FavoritesEmpty";
import { FavoritesList } from "./FavoritesList/FavoritesList";
import { usePresenter } from "./_logic/usePresenter";

// The favourites list in a drawer from the right, opened by the favourites button of either screen: the shows, the
// newest first, or a word on how to add one.
export const FavoritesDrawer: FC = () => {
    const { drawer, hasFavorites } = usePresenter();

    return <Drawer {...drawer}>{hasFavorites ? <FavoritesList /> : <FavoritesEmpty />}</Drawer>;
};
