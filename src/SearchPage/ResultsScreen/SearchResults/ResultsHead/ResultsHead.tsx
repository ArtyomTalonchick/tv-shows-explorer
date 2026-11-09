import { Box, chakra, Heading, Text } from "@chakra-ui/react";

export type ResultsHeadProps = {
  query: string;
  count: string | null;
};

// «Results / Shows for “dark”» and the count on the right.
export const ResultsHead = ({ query, count }: ResultsHeadProps) => {
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="end"
      flexWrap="wrap"
      gap="4"
      mb={{ base: "6", md: "8" }}
    >
      <Box minW="0">
        <Text textStyle="eyebrow">Results</Text>
        <Heading as="h2" textStyle="title" mt="3" overflowWrap="anywhere">
          Shows for{" "}
          <chakra.em fontStyle="normal" color="accent.fg">
            “{query}”
          </chakra.em>
        </Heading>
      </Box>
      {count && <Text color="fg.muted">{count}</Text>}
    </Box>
  );
};
