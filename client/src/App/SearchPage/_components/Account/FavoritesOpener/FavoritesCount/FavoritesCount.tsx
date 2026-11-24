import { chakra, type HTMLChakraProps } from "@chakra-ui/react";
import type { FC } from "react";
import { usePresenter } from "./_logic/usePresenter";

const TONE_STYLES = {
    zero: { bg: "bg.muted", color: "fg.muted" },
    some: { bg: "accent.solid", color: "accent.contrast" },
} satisfies Record<"zero" | "some", HTMLChakraProps<"span">>;

// .fav-button__count of design/library: the number of favourites in a round badge, in the accent, or grey for 0.
// A guest has none (.fav-button--guest). The button's end padding is the guest's; the badge's negative end margin
// gives it the user's, closer to the edge.
export const FavoritesCount: FC = () => {
    const { isShown, count, tone } = usePresenter();

    if (!isShown) {
        return null;
    }

    return (
        <chakra.span
            display="grid"
            placeItems="center"
            minW="6"
            h="6"
            px="2"
            me="-2"
            rounded="full"
            fontSize="xs"
            fontWeight="extrabold"
            {...TONE_STYLES[tone]}
        >
            {count}
        </chakra.span>
    );
};
