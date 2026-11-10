import { Box } from "@chakra-ui/react";
import type { FC } from "react";
import type { SearchStatus, Show } from "@/SearchPage/types";
import { SearchBar } from "./SearchBar/SearchBar";
import { SearchResults } from "./SearchResults/SearchResults";

export type ResultsScreenProps = {
  query: string;
  // The query of the shown results; the field may already hold the next one.
  shownQuery: string;
  status: SearchStatus;
  shows: Show[];
  isLoading: boolean;
  onQueryChange: (query: string) => void;
  onClear: () => void;
  onRetry: () => void;
};

// The screen with a query: the compact search bar and the results below it.
export const ResultsScreen: FC<ResultsScreenProps> = ({
  query,
  shownQuery,
  status,
  shows,
  isLoading,
  onQueryChange,
  onClear,
  onRetry,
}) => {
  return (
    <Box as="main" minH="100dvh" display="flex" flexDirection="column">
      <SearchBar query={query} isLoading={isLoading} onQueryChange={onQueryChange} onClear={onClear} />
      <SearchResults status={status} query={shownQuery} shows={shows} onRetry={onRetry} onClear={onClear} />
    </Box>
  );
};
