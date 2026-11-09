import { Box } from "@chakra-ui/react";
import { SkeletonCard } from "@/lib/components/SkeletonCard/SkeletonCard";

// One placeholder per card of a page.
const SKELETONS = [1, 2, 3];

// Loading: card skeletons while the request runs.
export const ResultsLoading = () => {
  return (
    <Box
      aria-busy="true"
      display="grid"
      gridTemplateColumns={{ base: "minmax(0, 1fr)", md: "repeat(3, minmax(0, 1fr))" }}
      gap="8"
    >
      {SKELETONS.map((n) => (
        <SkeletonCard key={n} />
      ))}
    </Box>
  );
};
