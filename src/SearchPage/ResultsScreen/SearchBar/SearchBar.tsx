import { Box, chakra, Container } from "@chakra-ui/react";
import type { FC, Ref } from "react";
import { SearchInput, type SearchInputProps } from "@/lib/components/SearchInput/SearchInput";
import { SEARCH_LABEL, SEARCH_PLACEHOLDER } from "@/SearchPage/constants";
import { Logo } from "@/SearchPage/components/Logo/Logo";

export type SearchBarProps = {
  query: string;
  isLoading: boolean;
  // Hidden while the screens swap.
  caretColor: SearchInputProps["caretColor"];
  inputRef: Ref<HTMLInputElement>;
  onQueryChange: (query: string) => void;
  onClear: () => void;
  onHome: () => void;
};

// The compact header of the results screen. Its field takes over the focus from the hero's field, and the view
// transition moves the field and the logo here from the hero. The logo leads back to the hero.
export const SearchBar: FC<SearchBarProps> = ({
  query,
  isLoading,
  caretColor,
  inputRef,
  onQueryChange,
  onClear,
  onHome,
}) => {
  return (
    <Box
      as="header"
      position="sticky"
      top="0"
      zIndex="3"
      borderBottomWidth="1px"
      borderColor="border"
      bg="bg.glass"
      backdropFilter="blur({blurs.glass})"
    >
      <Container
        maxW="content"
        px={{ base: "4", md: "12" }}
        py="4"
        display="flex"
        flexWrap={{ base: "wrap", md: "nowrap" }}
        alignItems="center"
        gap={{ base: "3", md: "8" }}
      >
        <chakra.button
          type="button"
          aria-label="tv/explorer — back to start"
          onClick={onHome}
          cursor="pointer"
          rounded="sm"
          focusVisibleRing="outside"
          focusRingColor="accent.solid"
        >
          <Logo />
        </chakra.button>
        <Box flex="1" display="flex" justifyContent="flex-end" minW={{ base: "full", md: "0" }}>
          <SearchInput
            ref={inputRef}
            label={SEARCH_LABEL}
            placeholder={SEARCH_PLACEHOLDER}
            size="sm"
            value={query}
            onChange={onQueryChange}
            onClear={onClear}
            isLoading={isLoading}
            caretColor={caretColor}
            autoFocus
            viewTransitionName="search-field"
          />
        </Box>
      </Container>
    </Box>
  );
};
