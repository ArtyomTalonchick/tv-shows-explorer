import { Box, Container, Heading, Text } from "@chakra-ui/react";

export function App() {
  return (
    <Box as="main" minH="100dvh" display="flex" alignItems="center">
      <Container maxW="content" px={{ base: "6", md: "12" }} py="24">
        <Box maxW="hero">
          <Text
            fontSize="xs"
            fontWeight="bold"
            letterSpacing="eyebrow"
            textTransform="uppercase"
            color="accent.fg"
            mb="6"
          >
            Coming soon
          </Text>
          <Heading as="h1" fontSize="display" fontWeight="black" lineHeight="display" letterSpacing="display">
            TV Shows Explorer
          </Heading>
          <Text fontSize="lg" color="fg.muted" mt="8">
            Find a show, see what it is about, and decide what to watch next.
          </Text>
        </Box>
      </Container>
    </Box>
  );
}
