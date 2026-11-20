import { chakra } from "@chakra-ui/react";
import type { FC } from "react";
import { FavoriteRow } from "./FavoriteRow/FavoriteRow";
import { usePresenter } from "./_logic/usePresenter";

// .fav-list of design/library: a row per favourite. The bookmark of a row removes the show, and the toast offers Undo.
export const FavoritesList: FC = () => {
    const { favorites } = usePresenter();

    return (
        <chakra.ul display="grid" gap="1" p="0" listStyle="none">
            {favorites.map((favorite) => (
                <FavoriteRow key={favorite.id} favorite={favorite} />
            ))}
        </chakra.ul>
    );
};
