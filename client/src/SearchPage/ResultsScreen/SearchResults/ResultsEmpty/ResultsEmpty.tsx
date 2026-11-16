import { Box, Button } from "@chakra-ui/react";
import type { FC } from "react";
import { StateMessage } from "@/lib/components/StateMessage/StateMessage";

export type ResultsEmptyProps = {
  query: string;
  onClear: () => void;
};

// No results: TVmaze found nothing for the query.
export const ResultsEmpty: FC<ResultsEmptyProps> = ({ query, onClear }) => {
  return (
    <Box flex="1" display="grid" mt="4">
      <StateMessage
        icon="search-off"
        title={<>Nothing found for “{query}”</>}
        text="Check the spelling or try another title."
        action={
          <Button variant="ghost" onClick={onClear}>
            Clear search
          </Button>
        }
      />
    </Box>
  );
};
