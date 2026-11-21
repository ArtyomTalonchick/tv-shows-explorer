import { chakra, type HTMLChakraProps } from "@chakra-ui/react";
import type { FC } from "react";
import { Icon } from "@/lib/ui-kit/Icon/Icon";
import { usePresenter, type FavoriteToggleProps } from "./_logic/usePresenter";

export type { FavoriteToggleProps } from "./_logic/usePresenter";

type Variant = NonNullable<FavoriteToggleProps["variant"]>;

const VARIANT_STYLES = {
    poster: {
        bg: "bg.glass",
        borderColor: "border",
        color: "fg",
        backdropFilter: "blur({blurs.glass})",
        _hover: { borderColor: "fg.subtle" },
    },
    plain: {
        bg: "transparent",
        borderColor: "transparent",
        color: "fg.muted",
        _hover: { bg: "border", color: "fg" },
    },
} satisfies Record<Variant, HTMLChakraProps<"button">>;

// .fav-toggle of design/library: a round bookmark button, filled in the accent while the show is a favourite. A
// bookmark, not a star: the star marks the rating.
export const FavoriteToggle: FC<FavoriteToggleProps> = (props) => {
    const { pressed, label, variant, handleClick } = usePresenter(props);

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
            {...VARIANT_STYLES[variant]}
            _pressed={{ color: "accent.fg", "& svg": { fill: "currentColor" }, _hover: { color: "accent.hover" } }}
        >
            <Icon name="bookmark" boxSize="5" />
        </chakra.button>
    );
};
