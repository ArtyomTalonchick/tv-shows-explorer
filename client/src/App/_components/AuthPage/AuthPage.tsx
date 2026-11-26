import { Box, Heading, Link, Text } from "@chakra-ui/react";
import type { FC } from "react";
import { Link as RouterLink } from "react-router";
import { Backdrop } from "~/App/_components/Backdrop/Backdrop";
import { Logo } from "~/App/_components/Logo/Logo";
import { TopBar } from "~/App/_components/TopBar/TopBar";
import { usePresenter, type AuthPageProps } from "./_logic/usePresenter";

export type { AuthPageProps } from "./_logic/usePresenter";

// The sign-in and sign-up pages of design/v0.3: the logo that leads back to the search, and .auth-card in the middle
// of the page over the backdrop of the start screen.
export const AuthPage: FC<AuthPageProps> = (props) => {
    const { eyebrow, title, text, children, footer } = usePresenter(props);

    return (
        <Box
            as="main"
            position="relative"
            minH="100dvh"
            display="grid"
            placeItems={{ base: "start center", md: "center" }}
            overflow="hidden"
            pt={{ base: "24", md: "30" }}
            pb={{ base: "10", md: "16" }}
            px={{ base: "4", md: "6" }}
        >
            <Backdrop />
            <TopBar>
                <Link
                    asChild
                    aria-label="tv/explorer — back to start"
                    rounded="sm"
                    focusRingColor="accent.solid"
                    _hover={{ textDecoration: "none" }}
                >
                    <RouterLink to="/">
                        <Logo />
                    </RouterLink>
                </Link>
            </TopBar>
            <Box
                position="relative"
                zIndex="2"
                display="grid"
                gap="8"
                w="full"
                maxW="form"
                p={{ base: "6", md: "8" }}
                borderWidth="1px"
                borderColor="border"
                rounded="lg"
                bg="bg.subtle"
                shadow="overlay"
            >
                <header>
                    <Text textStyle="eyebrow">{eyebrow}</Text>
                    <Heading
                        as="h1"
                        mt="3"
                        fontSize="2xl"
                        fontWeight="extrabold"
                        letterSpacing="tight"
                        lineHeight="tight"
                    >
                        {title}
                    </Heading>
                    <Text mt="2" color="fg.muted" fontSize="sm">
                        {text}
                    </Text>
                </header>
                {children}
                <Text color="fg.muted" fontSize="sm" textAlign="center">
                    {footer.text}{" "}
                    <Link asChild variant="accent">
                        <RouterLink to={footer.to} state={footer.state}>
                            {footer.link}
                        </RouterLink>
                    </Link>
                </Text>
            </Box>
        </Box>
    );
};
