import { Box, chakra } from "@chakra-ui/react";
import type { FC } from "react";
import { FavoriteToggle } from "~/App/_components/FavoriteToggle/FavoriteToggle";
import { ShowMeta } from "~/App/_components/ShowMeta/ShowMeta";
import { Icon } from "~/lib/ui-kit/Icon/Icon";
import { usePresenter, type FavoriteRowProps } from "./_logic/usePresenter";

export type { FavoriteRowProps } from "./_logic/usePresenter";

// .fav-row of design/library: a list item with a thumbnail, the name and one line of details, and a plain bookmark
// at its end. The name turns to the accent on hover, as on a show card.
export const FavoriteRow: FC<FavoriteRowProps> = (props) => {
    const { favorite, name, href, imageSrc, hasImage } = usePresenter(props);

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
                    {hasImage ? (
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
                        _groupHover={{ color: "accent.fg" }}
                    >
                        {name}
                    </chakra.span>
                    <ShowMeta show={favorite} mt="1" truncate />
                </Box>
            </chakra.a>
            <FavoriteToggle show={favorite} place="list" />
        </chakra.li>
    );
};
