import { Container } from "@chakra-ui/react";
import type { FC } from "react";
import { GenreFilter } from "./GenreFilter/GenreFilter";
import { ResultsEmpty } from "./ResultsEmpty/ResultsEmpty";
import { ResultsError } from "./ResultsError/ResultsError";
import { ResultsHead } from "./ResultsHead/ResultsHead";
import { ResultsIdle } from "./ResultsIdle/ResultsIdle";
import { ResultsList } from "./ResultsList/ResultsList";
import { ResultsLoading } from "./ResultsLoading/ResultsLoading";
import { usePresenter, type SearchResultsProps } from "./usePresenter";

export type { SearchResultsProps } from "./usePresenter";

// The results area: the heading and the genre chips, then the component of the current state. An empty field
// shows only the idle message.
export const SearchResults: FC<SearchResultsProps> = (props) => {
  const { query, head, genreFilter, isIdle, isLoading, isEmpty, isError, hasResults, shows, onRetry, onClear } =
    usePresenter(props);

  return (
    <Container
      as="section"
      aria-label="Search results"
      maxW="content"
      px={{ base: "4", md: "12" }}
      pt={{ base: "8", md: "12" }}
      pb={{ base: "10", md: "16" }}
      flex="1"
      display="flex"
      flexDirection="column"
    >
      {head && <ResultsHead {...head} />}
      {genreFilter && <GenreFilter {...genreFilter} />}
      {isIdle && <ResultsIdle />}
      {isLoading && <ResultsLoading />}
      {hasResults && <ResultsList shows={shows} />}
      {isEmpty && <ResultsEmpty query={query} onClear={onClear} />}
      {isError && <ResultsError onRetry={onRetry} />}
    </Container>
  );
};
