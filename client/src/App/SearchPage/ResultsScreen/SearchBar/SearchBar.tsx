import { Box, chakra, Container } from "@chakra-ui/react";
import type { FC } from "react";
import { SearchInput } from "@/lib/components/SearchInput/SearchInput";
import { SEARCH_FIELD_ID, SEARCH_LABEL, SEARCH_PLACEHOLDER } from "@/App/SearchPage/_logic/constants";
import { FavoritesOpener } from "@/App/SearchPage/_components/FavoritesOpener/FavoritesOpener";
import { Logo } from "@/App/SearchPage/_components/Logo/Logo";
import { usePresenter } from "./_logic/usePresenter";

// The compact header of the results screen. Its field takes over the focus from the hero's field, and the view
// transition moves the field and the logo here from the hero. The logo leads back to the hero; the favourites
// button is at the end. On a phone the logo and the button share the first row, and the field takes the second.
export const SearchBar: FC = () => {
    const { query, caretColor, onQueryChange, onClear, onHome } = usePresenter();

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
                <Box
                    flex="1"
                    display="flex"
                    justifyContent="flex-end"
                    minW={{ base: "full", md: "0" }}
                    order={{ base: "3", md: "0" }}
                >
                    <SearchInput
                        id={SEARCH_FIELD_ID}
                        label={SEARCH_LABEL}
                        placeholder={SEARCH_PLACEHOLDER}
                        size="sm"
                        value={query}
                        onChange={onQueryChange}
                        onClear={onClear}
                        caretColor={caretColor}
                        autoFocus
                        viewTransitionName="search-field"
                    />
                </Box>
                <Box ml={{ base: "auto", md: "0" }}>
                    <FavoritesOpener />
                </Box>
            </Container>
        </Box>
    );
};
