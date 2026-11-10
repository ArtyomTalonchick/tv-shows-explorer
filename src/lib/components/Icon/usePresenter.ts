import type { IconProps as ChakraIconProps } from "@chakra-ui/react";
// The sprite of design/library, as a file: <use> cannot point into a data: URL, so it must not be inlined.
import spriteUrl from "../../../../design/library/icons.svg?no-inline";

// The ids of the symbols in design/library/icons.svg. A test checks that each one is in the sprite.
export const ICON_NAMES = [
  "search",
  "close",
  "chevron-left",
  "chevron-right",
  "film",
  "search-off",
  "alert",
  "retry",
] as const;

export type IconName = (typeof ICON_NAMES)[number];

export type IconProps = Omit<ChakraIconProps, "children"> & { name: IconName };

type UsePresenterResult = {
  href: string;
  rest: Omit<IconProps, "name">;
};

export const usePresenter = ({ name, ...rest }: IconProps): UsePresenterResult => ({
  href: `${spriteUrl}#${name}`,
  rest,
});
