import { Box } from "@chakra-ui/react";
import type { FC } from "react";
import { SearchBar } from "./SearchBar/SearchBar";
import { SearchResults } from "./SearchResults/SearchResults";
import { usePresenter, type ResultsScreenProps } from "./usePresenter";

export type { ResultsScreenProps } from "./usePresenter";

// The screen after the hero: the compact search bar and the results below it.
export const ResultsScreen: FC<ResultsScreenProps> = (props) => {
  const { searchBar, searchResults } = usePresenter(props);

  return (
    <Box as="main" minH="100dvh" display="flex" flexDirection="column">
      <SearchBar {...searchBar} />
      <SearchResults {...searchResults} />
    </Box>
  );
};
