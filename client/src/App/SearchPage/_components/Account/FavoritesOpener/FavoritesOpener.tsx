import { chakra } from "@chakra-ui/react";
import type { FC } from "react";
import { Icon } from "~/lib/ui-kit/Icon/Icon";
import { usePresenter } from "./_logic/usePresenter";
import { FavoritesCount } from "./FavoritesCount/FavoritesCount";

// .fav-button of design/library, in the hero and in the search bar: a round glass button with a bookmark,
// «Favourites» and the number of them, which a guest does not have (.fav-button--guest). It opens the favourites list
// in a drawer. The line is as tall as the counter, so the button is as tall without it.
export const FavoritesOpener: FC = () => {
    const { open } = usePresenter();

    return (
        <chakra.button
            type="button"
            aria-haspopup="dialog"
            onClick={open}
            display="inline-flex"
            alignItems="center"
            gap="2"
            flex="none"
            py="2"
            px="4"
            borderWidth="1px"
            borderColor="border"
            rounded="full"
            bg="bg.glass"
            color="fg"
            backdropFilter="blur({blurs.glass})"
            fontSize="sm"
            fontWeight="semibold"
            lineHeight="{spacing.6}"
            whiteSpace="nowrap"
            cursor="pointer"
            transitionProperty="background, border-color"
            transitionDuration="fast"
            transitionTimingFunction="standard"
            focusVisibleRing="none"
            _focusVisible={{ outline: "3px solid", outlineColor: "accent.solid", outlineOffset: "3px" }}
            _hover={{ borderColor: "fg.subtle", bg: "bg.muted" }}
            _active={{ bg: "bg.subtle" }}
        >
            <Icon name="bookmark" boxSize="1.25em" />
            Favourites
            <FavoritesCount />
        </chakra.button>
    );
};
