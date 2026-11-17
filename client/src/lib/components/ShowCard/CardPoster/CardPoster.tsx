import { Box, chakra } from "@chakra-ui/react";
import type { FC } from "react";
import { Icon } from "@/lib/components/Icon/Icon";

export type CardPosterProps = {
    imageSrc: string | undefined;
    imageAlt: string;
    hasImage: boolean;
    ratingLabel: string | null;
};

// The poster of a show card with the rating on it, or «No poster» in its place. It grows a little on the card's
// hover.
export const CardPoster: FC<CardPosterProps> = ({ imageSrc, imageAlt, hasImage, ratingLabel }) => {
    return (
        <Box
            position="relative"
            gridRow="span 2"
            aspectRatio="2 / 3"
            rounded="md"
            overflow="hidden"
            bg="bg.subtle"
            boxShadow="poster"
        >
            {hasImage ? (
                <chakra.img
                    src={imageSrc}
                    alt={imageAlt}
                    loading="lazy"
                    display="block"
                    w="full"
                    h="full"
                    objectFit="cover"
                    transition="transform {durations.normal} {easings.standard}"
                    _groupHover={{ transform: "scale(1.04)" }}
                    _motionReduce={{ transition: "none" }}
                />
            ) : (
                <Box
                    position="absolute"
                    inset="0"
                    display="grid"
                    placeContent="center"
                    justifyItems="center"
                    gap="2"
                    color="fg.subtle"
                    fontSize="sm"
                >
                    <Icon name="film" boxSize="10" strokeWidth="1.5" />
                    No poster
                </Box>
            )}
            {ratingLabel && (
                <chakra.span
                    position="absolute"
                    top="3"
                    left="3"
                    px="2"
                    py="1"
                    rounded="full"
                    bg="accent.solid"
                    color="accent.contrast"
                    fontSize="xs"
                    fontWeight="extrabold"
                >
                    {ratingLabel}
                </chakra.span>
            )}
        </Box>
    );
};
