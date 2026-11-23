import { Box, Heading, Link, Text } from "@chakra-ui/react";
import type { FC } from "react";
import { Link as RouterLink } from "react-router";

type PagePlaceholderProps = {
    title: string;
};

// A page that has its address but not its content yet: its title and the way back to the search.
export const PagePlaceholder: FC<PagePlaceholderProps> = ({ title }) => {
    return (
        <Box as="main" minH="100dvh" display="grid" placeItems="center" px="4">
            <Box display="grid" justifyItems="center" gap="4" textAlign="center">
                <Heading as="h1" textStyle="title">
                    {title}
                </Heading>
                <Text color="fg.muted">This page is on its way.</Text>
                <Link asChild color="accent.fg">
                    <RouterLink to="/">Back to search</RouterLink>
                </Link>
            </Box>
        </Box>
    );
};
