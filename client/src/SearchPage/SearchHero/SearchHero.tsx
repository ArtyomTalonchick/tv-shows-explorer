import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import type { FC } from "react";
import { FavoritesOpener } from "@/SearchPage/_components/FavoritesOpener/FavoritesOpener";
import { Logo } from "@/SearchPage/_components/Logo/Logo";
import { PosterWall } from "./PosterWall/PosterWall";
import { SearchHeroInput } from "./SearchHeroInput/SearchHeroInput";

const layer = { content: '""', position: "absolute", inset: "0" } as const;

// The start screen: the full-viewport hero with the search field, the logo and the favourites button above it.
export const SearchHero: FC = () => {
    return (
        <Box
            as="main"
            position="relative"
            minH="100dvh"
            display="grid"
            placeItems="center"
            textAlign="center"
            overflow="hidden"
            pt="30"
            pb="24"
            px="6"
            _before={{
                ...layer,
                bgImage: "radial-gradient(60% 50% at 50% 55%, {colors.accent.glow}, transparent 70%)",
            }}
            _after={{ ...layer, bgImage: "radial-gradient(70% 70% at 50% 50%, transparent, {colors.bg} 85%)" }}
        >
            <Flex
                position="absolute"
                top={{ base: "6", md: "8" }}
                insetInline="0"
                px={{ base: "4", md: "12" }}
                zIndex="3"
                alignItems="center"
                justifyContent="space-between"
            >
                <Logo />
                <FavoritesOpener />
            </Flex>
            <PosterWall />
            <Box position="relative" zIndex="2" maxW="hero" display="grid" justifyItems="center">
                <Text textStyle="eyebrow">TVmaze · 80 000+ shows</Text>
                <Heading as="h1" textStyle="display" my="6">
                    Find your next obsession.
                </Heading>
                <Text textStyle="lead" maxW="prose" mb="10" fontSize={{ base: "lg", md: "xl" }}>
                    Search any show, see its rating and genres — in one dark, quiet place.
                </Text>
                <SearchHeroInput />
            </Box>
        </Box>
    );
};
