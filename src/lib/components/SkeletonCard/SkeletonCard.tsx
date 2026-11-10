import { Box, Skeleton } from "@chakra-ui/react";
import type { FC } from "react";

// The placeholder of a show card while results load. It keeps the layout of ShowCard, so the cards replace it
// without a jump: from md the poster is above the lines; below it, a thumbnail sits beside them.
export const SkeletonCard: FC = () => {
  return (
    <Box
      aria-hidden="true"
      display={{ base: "grid", md: "block" }}
      gridTemplateColumns="{sizes.thumb} minmax(0, 1fr)"
      columnGap="4"
      alignItems="center"
    >
      <Skeleton shape="poster" gridRow="span 2" />
      <Skeleton shape="line" alignSelf="end" mt={{ base: "0", md: "4" }} />
      <Skeleton shape="lineShort" alignSelf="start" />
    </Box>
  );
};
