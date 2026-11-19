import { Box, chakra, Heading } from "@chakra-ui/react";
import type { FC } from "react";
import { FavoriteToggle } from "@/App/_components/FavoriteToggle/FavoriteToggle";
import { ShowMeta } from "@/App/_components/ShowMeta/ShowMeta";
import { CardPoster } from "./CardPoster/CardPoster";
import { usePresenter, type ShowCardProps } from "./_logic/usePresenter";

export type { ShowCardProps } from "./_logic/usePresenter";

// ShowCard of design/library: the poster with the rating, the name and one line of details, and the bookmark. From
// md the poster is above the text and the bookmark on the poster's corner; below it, a thumbnail sits beside the
// text, as in the one-column list of design/v0.1, and the bookmark at the row's right end, away from the rating.
// The bookmark is beside the link, not in it: a button inside a link is not allowed.
export const ShowCard: FC<ShowCardProps> = (props) => {
    const { name, href, poster, meta, favorite } = usePresenter(props);

    return (
        <Box position="relative" minW="0">
            <chakra.a
                href={href}
                target="_blank"
                rel="noreferrer"
                className="group"
                display={{ base: "grid", md: "block" }}
                gridTemplateColumns="{sizes.thumb} minmax(0, 1fr)"
                columnGap="4"
                alignItems="center"
                minW="0"
                pr={{ base: "12", md: "0" }}
                rounded="md"
                focusVisibleRing="none"
                _focusVisible={{ outline: "3px solid", outlineColor: "accent.solid", outlineOffset: "3px" }}
            >
                <CardPoster {...poster} />
                <Heading
                    as="h3"
                    mt={{ base: "0", md: "4" }}
                    mb="1"
                    alignSelf="end"
                    fontSize="lg"
                    fontWeight="bold"
                    lineHeight="tight"
                    overflow="hidden"
                    textOverflow="ellipsis"
                    whiteSpace={{ base: "normal", md: "nowrap" }}
                    transition="color {durations.fast} {easings.standard}"
                    _groupHover={{ color: "accent.fg" }}
                >
                    {name}
                </Heading>
                <ShowMeta
                    {...meta}
                    alignSelf="start"
                    overflow="hidden"
                    textOverflow="ellipsis"
                    whiteSpace={{ base: "normal", md: "nowrap" }}
                />
            </chakra.a>
            <Box
                position="absolute"
                top={{ base: "calc(50% - {spacing.10} / 2)", md: "3" }}
                right={{ base: "0", md: "3" }}
            >
                <FavoriteToggle {...favorite} />
            </Box>
        </Box>
    );
};
