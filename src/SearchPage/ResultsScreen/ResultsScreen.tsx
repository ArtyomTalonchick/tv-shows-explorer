import { Box } from "@chakra-ui/react";
import type { SearchStatus, Show } from "@/SearchPage/types";
import { SearchBar } from "./SearchBar/SearchBar";
import { SearchResults } from "./SearchResults/SearchResults";

export type ResultsScreenProps = {
  query: string;
  status: SearchStatus;
  shows: Show[];
  isLoading: boolean;
  onQueryChange: (query: string) => void;
  onClear: () => void;
  onRetry: () => void;
};

// The screen with a query: the compact search bar and the results below it.
export const ResultsScreen = ({
  query,
  status,
  shows,
  isLoading,
  onQueryChange,
  onClear,
  onRetry,
}: ResultsScreenProps) => {
  return (
    <Box as="main" minH="100dvh" display="flex" flexDirection="column">
      <SearchBar query={query} isLoading={isLoading} onQueryChange={onQueryChange} onClear={onClear} />
      <SearchResults status={status} query={query} shows={shows} onRetry={onRetry} onClear={onClear} />
    </Box>
  );
};
