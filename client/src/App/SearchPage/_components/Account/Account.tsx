import { Flex } from "@chakra-ui/react";
import type { FC } from "react";
import { FavoritesOpener } from "./FavoritesOpener/FavoritesOpener";

// .account of the design, at the end of the hero's top row and of the search bar: the favourites button and the
// account of the visitor. On a phone they stand closer, so they fit on one row with the logo.
export const Account: FC = () => {
    return (
        <Flex alignItems="center" gap={{ base: "2", md: "3" }}>
            <FavoritesOpener />
        </Flex>
    );
};
