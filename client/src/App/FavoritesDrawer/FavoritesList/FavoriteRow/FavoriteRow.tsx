import { Box, chakra, type HTMLChakraProps } from "@chakra-ui/react";
import type { FC } from "react";
import { FavoriteToggle } from "~/App/_components/FavoriteToggle/FavoriteToggle";
import { ShowMeta } from "~/App/_components/ShowMeta/ShowMeta";
import { Icon } from "~/lib/ui-kit/Icon/Icon";
import { usePresenter, type FavoriteRowProps, type FavoriteRowState } from "./_logic/usePresenter";

export type { FavoriteRowProps } from "./_logic/usePresenter";

// .fav-row--removed: a removed row is dimmed, and its name gets no accent on hover.
const STATE_STYLES = {
    saved: { link: {}, name: { _groupHover: { color: "accent.fg" } } },
    removed: { link: { opacity: 0.4 }, name: {} },
} satisfies Record<FavoriteRowState, { link: HTMLChakraProps<"a">; name: HTMLChakraProps<"span"> }>;

// .fav-row of design/library: a list item with a thumbnail, the name and one line of details, and a plain bookmark
// at its end. The name turns to the accent on hover, as on a show card. A show removed while the list is open keeps
// its row, dimmed, with «Removed» in place of the details; its bookmark puts it back.
export const FavoriteRow: FC<FavoriteRowProps> = (props) => {
    const { favorite, state, isRemoved, name, href, imageSrc } = usePresenter(props);

    return (
        <chakra.li
            className="group"
            minW="0"
            display="flex"
            alignItems="center"
            gap="2"
            p="2"
            rounded="md"
            transition="background {durations.fast} {easings.standard}"
            _hover={{ bg: "bg.muted" }}
        >
            <chakra.a
                href={href}
                target="_blank"
                rel="noreferrer"
                flex="1"
                minW="0"
                display="flex"
                alignItems="center"
                gap="4"
                rounded="sm"
                focusVisibleRing="none"
                _focusVisible={{ outline: "3px solid", outlineColor: "accent.solid", outlineOffset: "3px" }}
                {...STATE_STYLES[state].link}
            >
                <Box
                    display="grid"
                    placeItems="center"
                    w="12"
                    aspectRatio="2 / 3"
                    flex="none"
                    overflow="hidden"
                    borderWidth="1px"
                    borderColor="border"
                    rounded="sm"
                    bg="bg"
                    color="fg.subtle"
                >
                    {imageSrc ? (
                        <chakra.img src={imageSrc} alt="" display="block" w="full" h="full" objectFit="cover" />
                    ) : (
                        <Icon name="film" boxSize="5" />
                    )}
                </Box>
                <Box minW="0">
                    <chakra.span
                        display="block"
                        fontSize="md"
                        fontWeight="bold"
                        lineHeight="tight"
                        truncate
                        transition="color {durations.fast} {easings.standard}"
                        {...STATE_STYLES[state].name}
                    >
                        {name}
                    </chakra.span>
                    {isRemoved ? (
                        <chakra.span display="block" mt="1" textStyle="eyebrow" color="fg.subtle">
                            Removed
                        </chakra.span>
                    ) : (
                        <ShowMeta show={favorite} mt="1" truncate />
                    )}
                </Box>
            </chakra.a>
            <FavoriteToggle show={favorite} place="list" />
        </chakra.li>
    );
};
