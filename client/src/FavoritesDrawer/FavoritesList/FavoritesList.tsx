import { chakra } from "@chakra-ui/react";
import type { FC } from "react";
import { FavoriteRow } from "./FavoriteRow/FavoriteRow";
import { usePresenter, type FavoritesListProps } from "./_logic/usePresenter";

export type { FavoritesListProps } from "./_logic/usePresenter";

// .fav-list of design/library: a row per favourite. The bookmark of a row removes the show, and the toast offers Undo.
export const FavoritesList: FC<FavoritesListProps> = (props) => {
    const { rows } = usePresenter(props);

    return (
        <chakra.ul display="grid" gap="1" p="0" listStyle="none">
            {rows.map((row) => (
                <FavoriteRow key={row.id} {...row.props} />
            ))}
        </chakra.ul>
    );
};
