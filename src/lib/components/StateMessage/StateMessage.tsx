import { Box, Heading, Text } from "@chakra-ui/react";
import { Icon } from "@/lib/components/Icon/Icon";
import { usePresenter, type StateMessageProps } from "./usePresenter";

export type { StateMessageProps } from "./usePresenter";

// EmptyState and ErrorState of design/library; the styles are the `stateMessage` slot recipe of the theme.
export const StateMessage = (props: StateMessageProps) => {
  const { icon, title, text, action, styles, role } = usePresenter(props);

  return (
    <Box role={role} css={styles.root}>
      <Box css={styles.indicator}>
        <Icon name={icon} />
      </Box>
      <Heading as="h3" css={styles.title}>
        {title}
      </Heading>
      <Text css={styles.text}>{text}</Text>
      {action && <Box css={styles.action}>{action}</Box>}
    </Box>
  );
};
