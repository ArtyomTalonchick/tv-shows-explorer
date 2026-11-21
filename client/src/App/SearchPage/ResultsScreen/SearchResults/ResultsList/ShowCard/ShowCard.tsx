import { Box, chakra, Heading } from "@chakra-ui/react";
import type { Show } from "@tv-shows-explorer/shared";
import type { FC } from "react";
import { FavoriteToggle } from "~/App/_components/FavoriteToggle/FavoriteToggle";
import { ShowMeta } from "~/App/_components/ShowMeta/ShowMeta";
import { CardPoster } from "./CardPoster/CardPoster";

export type ShowCardProps = {
    show: Show;
};

// ShowCard of design/library: the poster with the rating, the name and one line of details, and the bookmark. From
// md the poster is above the text and the bookmark on the poster's corner; below it, a thumbnail sits beside the
// text, as in the one-column list of design/v0.1, and the bookmark at the row's right end, away from the rating.
// The bookmark is beside the link, not in it: a button inside a link is not allowed.
export const ShowCard: FC<ShowCardProps> = ({ show }) => {
    return (
        <Box position="relative" minW="0">
            <chakra.a
                href={show.url}
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
                <CardPoster show={show} />
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
                    {show.name}
                </Heading>
                <ShowMeta
                    show={show}
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
                <FavoriteToggle show={show} />
            </Box>
        </Box>
    );
};
