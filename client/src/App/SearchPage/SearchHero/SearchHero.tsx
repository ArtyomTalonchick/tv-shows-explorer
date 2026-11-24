import { Box, Heading, Text } from "@chakra-ui/react";
import type { FC } from "react";
import { Account } from "~/App/SearchPage/_components/Account/Account";
import { Backdrop } from "~/App/_components/Backdrop/Backdrop";
import { Logo } from "~/App/_components/Logo/Logo";
import { TopBar } from "~/App/_components/TopBar/TopBar";
import { SearchHeroInput } from "./SearchHeroInput/SearchHeroInput";

// The start screen: the full-viewport hero with the search field, the logo and the account block above it.
export const SearchHero: FC = () => {
    return (
        <Box
            as="main"
            position="relative"
            minH="100dvh"
            display="grid"
            placeItems="center"
            textAlign="center"
            overflow="hidden"
            pt="30"
            pb="24"
            px="6"
        >
            <Backdrop />
            <TopBar>
                <Logo />
                <Account />
            </TopBar>
            <Box position="relative" zIndex="2" maxW="hero" display="grid" justifyItems="center">
                <Text textStyle="eyebrow">TVmaze · 80 000+ shows</Text>
                <Heading as="h1" textStyle="display" my="6">
                    Find your next obsession.
                </Heading>
                <Text textStyle="lead" maxW="prose" mb="10" fontSize={{ base: "lg", md: "xl" }}>
                    Search any show, see its rating and genres — in one dark, quiet place.
                </Text>
                <SearchHeroInput />
            </Box>
        </Box>
    );
};
