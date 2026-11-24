import type { FC } from "react";
import { Drawer } from "~/lib/ui-kit/Drawer/Drawer";
import { FavoritesEmpty } from "./FavoritesEmpty/FavoritesEmpty";
import { FavoritesGuest } from "./FavoritesGuest/FavoritesGuest";
import { FavoritesList } from "./FavoritesList/FavoritesList";
import { FavoritesTitle } from "./FavoritesTitle/FavoritesTitle";
import { usePresenter, type FavoritesContent } from "./_logic/usePresenter";

// What the drawer shows, by the key its Presenter chooses.
const CONTENTS = {
    guest: FavoritesGuest,
    empty: FavoritesEmpty,
    list: FavoritesList,
} satisfies Record<FavoritesContent, FC>;

// The favourites list in a drawer from the right, opened by the favourites button of either screen: the shows, the
// newest first, a word on how to add one, or for a guest the way to sign in.
export const FavoritesDrawer: FC = () => {
    const { drawer, content } = usePresenter();
    const Content = CONTENTS[content];

    return (
        <Drawer {...drawer} title={<FavoritesTitle />}>
            <Content />
        </Drawer>
    );
};
