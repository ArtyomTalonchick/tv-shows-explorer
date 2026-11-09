import { Container } from "@chakra-ui/react";
import { ResultsEmpty } from "./ResultsEmpty/ResultsEmpty";
import { ResultsError } from "./ResultsError/ResultsError";
import { ResultsHead } from "./ResultsHead/ResultsHead";
import { ResultsList } from "./ResultsList/ResultsList";
import { ResultsLoading } from "./ResultsLoading/ResultsLoading";
import { usePresenter, type SearchResultsProps } from "./usePresenter";

export type { SearchResultsProps } from "./usePresenter";

// The results area: the heading, then the component of the current state.
export const SearchResults = (props: SearchResultsProps) => {
  const { query, countLabel, isLoading, isEmpty, isError, hasResults, names, onRetry, onClear } = usePresenter(props);

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
      <ResultsHead query={query} count={countLabel} />
      {isLoading && <ResultsLoading />}
      {hasResults && <ResultsList names={names} />}
      {isEmpty && <ResultsEmpty query={query} onClear={onClear} />}
      {isError && <ResultsError onRetry={onRetry} />}
    </Container>
  );
};
