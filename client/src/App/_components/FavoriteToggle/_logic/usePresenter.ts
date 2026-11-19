import type { HTMLChakraProps } from "@chakra-ui/react";
import type { Show } from "@tv-shows-explorer/shared";
import { useFavoriteToggle } from "./useFavoriteToggle/useFavoriteToggle";

export type FavoriteToggleProps = {
    // The show the bookmark adds to the favourites or removes from them.
    show: Pick<Show, "id" | "name">;
    // `poster` floats over a poster in a glass circle; `plain` sits in a row of the favourites list.
    variant?: "poster" | "plain";
};

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

type UsePresenterResult = {
    pressed: boolean;
    label: string;
    // The change is on its way: a press does nothing until it is done.
    busy: boolean;
    variantStyles: HTMLChakraProps<"button">;
    handleClick: () => void;
};

export const usePresenter = ({ show, variant = "poster" }: FavoriteToggleProps): UsePresenterResult => {
    const { pressed, busy, label, toggle } = useFavoriteToggle(show);

    // Not `disabled` while busy: a disabled button drops the focus of a keyboard user.
    const handleClick = (): void => {
        if (!busy) {
            toggle();
        }
    };

    return { pressed, label, busy, variantStyles: VARIANT_STYLES[variant], handleClick };
};
