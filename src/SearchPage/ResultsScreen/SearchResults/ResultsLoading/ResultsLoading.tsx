import { Box, Skeleton } from "@chakra-ui/react";
import { SkeletonCard } from "@/lib/components/SkeletonCard/SkeletonCard";

// Placeholders for a row of genre chips.
const CHIP_SKELETONS = [1, 2, 3, 4, 5];

// One placeholder per card of a page.
const CARD_SKELETONS = [1, 2, 3];

// Loading: chip and card skeletons while the request runs.
export const ResultsLoading = () => {
  return (
    <Box>
      <Box
        aria-hidden="true"
        display="flex"
        gap="2"
        overflowX="hidden"
        mx={{ base: "-4", md: "0" }}
        px={{ base: "4", md: "0" }}
        mb={{ base: "8", md: "10" }}
      >
        {CHIP_SKELETONS.map((n) => (
          <Skeleton key={n} shape="chip" />
        ))}
      </Box>
      <Box
        aria-busy="true"
        display="grid"
        gridTemplateColumns={{ base: "minmax(0, 1fr)", md: "repeat(3, minmax(0, 1fr))" }}
        gap="8"
      >
        {CARD_SKELETONS.map((n) => (
          <SkeletonCard key={n} />
        ))}
      </Box>
    </Box>
  );
};
