import { Box, Container } from "@chakra-ui/react";
import type { FC } from "react";
import { SearchInput } from "@/lib/components/SearchInput/SearchInput";
import { SEARCH_LABEL, SEARCH_PLACEHOLDER } from "@/SearchPage/constants";
import { Logo } from "@/SearchPage/components/Logo/Logo";

export type SearchBarProps = {
  query: string;
  isLoading: boolean;
  onQueryChange: (query: string) => void;
  onClear: () => void;
};

// The compact header shown once there is a query. Its field takes over the focus from the hero's field,
// and the view transition moves the field and the logo here from the hero.
export const SearchBar: FC<SearchBarProps> = ({ query, isLoading, onQueryChange, onClear }) => {
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
        <Logo />
        <Box flex="1" display="flex" justifyContent="flex-end" minW={{ base: "full", md: "0" }}>
          <SearchInput
            label={SEARCH_LABEL}
            placeholder={SEARCH_PLACEHOLDER}
            size="sm"
            value={query}
            onChange={onQueryChange}
            onClear={onClear}
            isLoading={isLoading}
            autoFocus
            viewTransitionName="search-field"
          />
        </Box>
      </Container>
    </Box>
  );
};
