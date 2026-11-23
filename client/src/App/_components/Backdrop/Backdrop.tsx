import { Box } from "@chakra-ui/react";
import type { FC } from "react";
import { PosterWall } from "./PosterWall/PosterWall";

const layer = { content: '""', position: "absolute", inset: "0", zIndex: "1" } as const;

// .backdrop of design/v0.3: the faded wall of posters with an accent glow in the middle, fading into the page at its
// edges. It fills its parent, which is `position: relative`, under the parent's content.
export const Backdrop: FC = () => {
    return (
        <Box
            aria-hidden="true"
            position="absolute"
            inset="0"
            overflow="hidden"
            _before={{
                ...layer,
                bgImage: "radial-gradient(60% 50% at 50% 55%, {colors.accent.glow}, transparent 70%)",
            }}
            _after={{ ...layer, bgImage: "radial-gradient(70% 70% at 50% 50%, transparent, {colors.bg} 85%)" }}
        >
            <PosterWall />
        </Box>
    );
};
