import type { HTMLChakraProps } from "@chakra-ui/react";

export type FavoriteToggleProps = {
    pressed: boolean;
    // What a press does, for screen readers: «Add Dark to favourites».
    label: string;
    onClick: () => void;
    // The change is on its way: a press does nothing until it is done.
    busy?: boolean;
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

type UsePresenterResult = Pick<FavoriteToggleProps, "pressed" | "label" | "busy"> & {
    variantStyles: HTMLChakraProps<"button">;
    handleClick: () => void;
};

export const usePresenter = ({
    pressed,
    label,
    onClick,
    busy = false,
    variant = "poster",
}: FavoriteToggleProps): UsePresenterResult => {
    // Not `disabled` while busy: a disabled button drops the focus of a keyboard user.
    const handleClick = (): void => {
        if (!busy) {
            onClick();
        }
    };

    return { pressed, label, busy, variantStyles: VARIANT_STYLES[variant], handleClick };
};
