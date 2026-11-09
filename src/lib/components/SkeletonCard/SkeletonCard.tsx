import { Box, Skeleton } from "@chakra-ui/react";

// The placeholder of a show card while results load.
export const SkeletonCard = () => {
  return (
    <Box aria-hidden="true">
      <Skeleton shape="poster" />
      <Skeleton shape="line" />
      <Skeleton shape="lineShort" />
    </Box>
  );
};
