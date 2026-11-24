import { Flex } from "@chakra-ui/react";
import type { FC } from "react";
import { usePresenter } from "./_logic/usePresenter";
import { FavoritesOpener } from "./FavoritesOpener/FavoritesOpener";
import { SignInLink } from "./SignInLink/SignInLink";
import { UserMenu } from "./UserMenu/UserMenu";

// .account of the design, at the end of the hero's top row and of the search bar: the favourites button, then the
// user's menu or, for a guest, «Sign in». On a phone they stand closer, so they fit on one row with the logo.
export const Account: FC = () => {
    const { isSignedIn } = usePresenter();

    return (
        <Flex alignItems="center" gap={{ base: "2", md: "3" }}>
            <FavoritesOpener />
            {isSignedIn ? <UserMenu /> : <SignInLink />}
        </Flex>
    );
};
