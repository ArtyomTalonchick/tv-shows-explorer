import { Box, Button } from "@chakra-ui/react";
import { Icon } from "@/lib/components/Icon/Icon";
import { StateMessage } from "@/lib/components/StateMessage/StateMessage";

export type ResultsErrorProps = {
  onRetry: () => void;
};

// Error: the request failed; Retry sends the current query again.
export const ResultsError = ({ onRetry }: ResultsErrorProps) => {
  return (
    <Box flex="1" display="grid" mt="4">
      <StateMessage
        tone="error"
        icon="alert"
        title="Could not load shows"
        text="TVmaze did not answer. Check your connection and try again."
        action={
          <Button onClick={onRetry}>
            <Icon name="retry" />
            Retry
          </Button>
        }
      />
    </Box>
  );
};
