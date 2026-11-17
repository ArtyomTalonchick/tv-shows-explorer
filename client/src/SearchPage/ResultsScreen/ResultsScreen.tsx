import { Box } from "@chakra-ui/react";
import type { FC } from "react";
import { SearchBar } from "./SearchBar/SearchBar";
import { SearchResults } from "./SearchResults/SearchResults";

// The screen after the hero: the compact search bar and the results below it.
export const ResultsScreen: FC = () => {
    return (
        <Box as="main" minH="100dvh" display="flex" flexDirection="column">
            <SearchBar />
            <SearchResults />
        </Box>
    );
};
