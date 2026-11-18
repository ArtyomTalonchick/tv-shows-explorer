import { Box, Image } from "@chakra-ui/react";
import type { FC } from "react";
import { usePresenter } from "./_logic/usePresenter";

// The faded, tilted wall of posters behind the hero.
export const PosterWall: FC = () => {
    const { posters } = usePresenter();

    return (
        <Box
            aria-hidden="true"
            position="absolute"
            inset="-2.5rem"
            display="grid"
            gridTemplateColumns={{ base: "repeat(4, 1fr)", md: "repeat(8, 1fr)" }}
            gap="3"
            opacity={0.14}
            filter="grayscale(.6) blur(2px)"
            transform="rotate(-6deg) scale(1.15)"
        >
            {posters.map((poster) => (
                <Image
                    key={poster.key}
                    src={poster.src}
                    alt=""
                    w="full"
                    aspectRatio={2 / 3}
                    objectFit="cover"
                    rounded="sm"
                />
            ))}
        </Box>
    );
};
