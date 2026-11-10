import { Box, Heading, Image, Text } from "@chakra-ui/react";
import type { FC } from "react";
import { SearchInput } from "@/lib/components/SearchInput/SearchInput";
import { SEARCH_LABEL, SEARCH_PLACEHOLDER } from "@/SearchPage/constants";
import { Logo } from "@/SearchPage/components/Logo/Logo";
import { usePresenter, type SearchHeroProps } from "./usePresenter";

export type { SearchHeroProps } from "./usePresenter";

const layer = { content: '""', position: "absolute", inset: "0" } as const;

// The start screen: the full-viewport hero with the search field only. The field is not focused on start:
// focusing it opens the results screen.
export const SearchHero: FC<SearchHeroProps> = (props) => {
  const { query, onQueryChange, onOpen, handleTouchEnd, wall } = usePresenter(props);

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
      _before={{ ...layer, bgImage: "radial-gradient(60% 50% at 50% 55%, {colors.accent.glow}, transparent 70%)" }}
      _after={{ ...layer, bgImage: "radial-gradient(70% 70% at 50% 50%, transparent, {colors.bg} 85%)" }}
    >
      <Box position="absolute" top={{ base: "6", md: "8" }} left={{ base: "4", md: "12" }} zIndex="3">
        <Logo />
      </Box>
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
        {wall.map((poster) => (
          <Image key={poster.key} src={poster.src} alt="" w="full" aspectRatio={2 / 3} objectFit="cover" rounded="sm" />
        ))}
      </Box>
      <Box position="relative" zIndex="2" maxW="hero" display="grid" justifyItems="center">
        <Text textStyle="eyebrow">TVmaze · 80 000+ shows</Text>
        <Heading as="h1" textStyle="display" my="6">
          Find your next obsession.
        </Heading>
        <Text textStyle="lead" maxW="prose" mb="10" fontSize={{ base: "lg", md: "xl" }}>
          Search any show, see its rating and genres — in one dark, quiet place.
        </Text>
        <SearchInput
          label={SEARCH_LABEL}
          placeholder={SEARCH_PLACEHOLDER}
          value={query}
          onChange={onQueryChange}
          onFocus={onOpen}
          onTouchEnd={handleTouchEnd}
          // The field hands the focus on at once; iOS would draw its caret flying away.
          caretColor="transparent"
          viewTransitionName="search-field"
        />
      </Box>
    </Box>
  );
};
