import { chakra, type HTMLChakraProps } from "@chakra-ui/react";
import type { FC } from "react";
import { Icon } from "~/lib/ui-kit/Icon/Icon";
import type { FavoriteTogglePlace } from "./_logic/toggle/toggle";
import { usePresenter, type FavoriteToggleProps } from "./_logic/usePresenter";

export type { FavoriteTogglePlace } from "./_logic/toggle/toggle";
export type { FavoriteToggleProps } from "./_logic/usePresenter";

const PLACE_STYLES = {
    card: {
        bg: "bg.glass",
        borderColor: "border",
        color: "fg",
        backdropFilter: "blur({blurs.glass})",
        _hover: { borderColor: "fg.subtle" },
    },
    list: {
        bg: "transparent",
        borderColor: "transparent",
        color: "fg.muted",
        _hover: { bg: "border", color: "fg" },
    },
} satisfies Record<FavoriteTogglePlace, HTMLChakraProps<"button">>;

// .fav-toggle of design/library: a round bookmark button, filled in the accent while the show is a favourite. A
// bookmark, not a star: the star marks the rating.
export const FavoriteToggle: FC<FavoriteToggleProps> = (props) => {
    const { pressed, label, place, handleClick } = usePresenter(props);

    return (
        <chakra.button
            type="button"
            aria-pressed={pressed}
            aria-label={label}
            onClick={handleClick}
            display="grid"
            placeItems="center"
            boxSize="10"
            flex="none"
            p="0"
            borderWidth="1px"
            rounded="full"
            cursor="pointer"
            transition="color {durations.fast} {easings.standard}, border-color {durations.fast} {easings.standard}, background {durations.fast} {easings.standard}, transform {durations.fast} {easings.standard}"
            focusVisibleRing="none"
            _focusVisible={{ outline: "3px solid", outlineColor: "accent.solid", outlineOffset: "3px" }}
            _active={{ transform: "scale(0.9)" }}
            {...PLACE_STYLES[place]}
            _pressed={{ color: "accent.fg", "& svg": { fill: "currentColor" }, _hover: { color: "accent.hover" } }}
        >
            <Icon name="bookmark" boxSize="5" />
        </chakra.button>
    );
};
