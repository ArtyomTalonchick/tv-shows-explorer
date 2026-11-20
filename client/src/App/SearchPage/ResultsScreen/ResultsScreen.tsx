import { Box } from "@chakra-ui/react";
import type { FC } from "react";
import { SearchBar } from "./SearchBar/SearchBar";
import { SearchResults } from "./SearchResults/SearchResults";
import { usePresenter } from "./_logic/usePresenter";

// The screen after the hero: the compact search bar and the results below it. Both clear the search the same way:
// the field is emptied and gets the focus back.
export const ResultsScreen: FC = () => {
    const { searchBar, results } = usePresenter();

    return (
        <Box as="main" minH="100dvh" display="flex" flexDirection="column">
            <SearchBar {...searchBar} />
            <SearchResults {...results} />
        </Box>
    );
};
