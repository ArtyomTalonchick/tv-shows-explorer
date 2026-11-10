import { Box, Heading, Text } from "@chakra-ui/react";
import type { FC } from "react";
import { Icon } from "@/lib/components/Icon/Icon";
import { usePresenter, type StateMessageProps } from "./usePresenter";

export type { StateMessageProps } from "./usePresenter";

// .state and .state--error of design/library: EmptyState and ErrorState.
export const StateMessage: FC<StateMessageProps> = (props) => {
  const { icon, title, text, action, borderStyle, indicatorColor, role } = usePresenter(props);

  return (
    <Box
      role={role}
      display="grid"
      justifyItems="center"
      alignContent="center"
      gap="3"
      textAlign="center"
      py="16"
      px="6"
      borderWidth="1px"
      borderStyle={borderStyle}
      borderColor="border"
      rounded="lg"
    >
      <Box display="grid" placeItems="center" boxSize="16" mb="2" rounded="full" bg="bg.subtle" color={indicatorColor}>
        <Icon name={icon} boxSize="8" strokeWidth="1.75" />
      </Box>
      <Heading as="h3" fontSize="xl" fontWeight="bold">
        {title}
      </Heading>
      <Text color="fg.muted" maxW="prose">
        {text}
      </Text>
      {action && <Box mt="3">{action}</Box>}
    </Box>
  );
};
