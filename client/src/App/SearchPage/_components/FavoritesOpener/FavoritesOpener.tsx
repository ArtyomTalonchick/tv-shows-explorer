import { chakra, type HTMLChakraProps } from "@chakra-ui/react";
import type { FC } from "react";
import { Icon } from "@/lib/ui-kit/Icon/Icon";
import { usePresenter } from "./_logic/usePresenter";

const COUNT_STYLES = {
    zero: { bg: "bg.muted", color: "fg.muted" },
    some: { bg: "accent.solid", color: "accent.contrast" },
} satisfies Record<"zero" | "some", HTMLChakraProps<"span">>;

// .fav-button of design/library, in the hero and in the search bar: a round glass button with a bookmark,
// «Favourites» and the number of them. It opens the favourites list in a drawer.
export const FavoritesOpener: FC = () => {
    const { count, countTone, open } = usePresenter();

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
            pl="4"
            pr="2"
            borderWidth="1px"
            borderColor="border"
            rounded="full"
            bg="bg.glass"
            color="fg"
            backdropFilter="blur({blurs.glass})"
            fontSize="sm"
            fontWeight="semibold"
            lineHeight="tight"
            whiteSpace="nowrap"
            cursor="pointer"
            transition="background {durations.fast} {easings.standard}, border-color {durations.fast} {easings.standard}"
            focusVisibleRing="none"
            _focusVisible={{ outline: "3px solid", outlineColor: "accent.solid", outlineOffset: "3px" }}
            _hover={{ borderColor: "fg.subtle", bg: "bg.muted" }}
            _active={{ bg: "bg.subtle" }}
        >
            <Icon name="bookmark" boxSize="1.25em" />
            Favourites
            <chakra.span
                display="grid"
                placeItems="center"
                minW="6"
                h="6"
                px="2"
                rounded="full"
                fontSize="xs"
                fontWeight="extrabold"
                {...COUNT_STYLES[countTone]}
            >
                {count}
            </chakra.span>
        </chakra.button>
    );
};
