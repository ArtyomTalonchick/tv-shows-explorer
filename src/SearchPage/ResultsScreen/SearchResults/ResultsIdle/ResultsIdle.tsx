import { Box } from "@chakra-ui/react";
import type { FC } from "react";
import { StateMessage } from "@/lib/components/StateMessage/StateMessage";

// An empty field on the results screen: the user has not typed a query yet, or has cleared it.
export const ResultsIdle: FC = () => {
  return (
    <Box flex="1" display="grid">
      <StateMessage icon="search" title="Search for a show" text="Type a title — results appear as you type." />
    </Box>
  );
};
