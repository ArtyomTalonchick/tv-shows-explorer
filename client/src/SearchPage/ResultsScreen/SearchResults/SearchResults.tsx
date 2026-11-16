import { Box, Container } from "@chakra-ui/react";
import type { FC } from "react";
import { GenreFilter } from "./GenreFilter/GenreFilter";
import { ResultsEmpty } from "./ResultsEmpty/ResultsEmpty";
import { ResultsError } from "./ResultsError/ResultsError";
import { ResultsHead } from "./ResultsHead/ResultsHead";
import { ResultsIdle } from "./ResultsIdle/ResultsIdle";
import { ResultsList } from "./ResultsList/ResultsList";
import { ResultsLoading } from "./ResultsLoading/ResultsLoading";
import { usePresenter, type SearchResultsProps } from "./logic/usePresenter";

export type { SearchResultsProps } from "./logic/usePresenter";

// The results area: the heading and the genre chips, then the component of the current state. An empty field
// shows only the idle message. While the shown results wait for the next answer they cannot be pressed, and they
// dim unless the answer comes within a moment.
export const SearchResults: FC<SearchResultsProps> = (props) => {
    const { query, head, genreFilter, list, isBusy, isIdle, isLoading, isEmpty, isError, onRetry, onClear } =
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
            <Box
                aria-busy={isBusy}
                inert={isBusy}
                transition="opacity {durations.normal} {easings.standard}"
                _loading={{ opacity: "0.5", transitionDelay: "{durations.fast}" }}
                _motionReduce={{ transitionDuration: "0s" }}
            >
                {head && <ResultsHead {...head} />}
                {genreFilter && <GenreFilter {...genreFilter} />}
                {list && <ResultsList {...list} />}
            </Box>
            {isIdle && <ResultsIdle />}
            {isLoading && <ResultsLoading />}
            {isEmpty && <ResultsEmpty query={query} onClear={onClear} />}
            {isError && <ResultsError onRetry={onRetry} />}
        </Container>
    );
};
