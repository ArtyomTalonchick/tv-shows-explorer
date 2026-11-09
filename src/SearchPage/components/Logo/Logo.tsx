import { chakra, Text } from "@chakra-ui/react";

// The «tv/explorer» wordmark. One is on screen at a time, so it moves between the hero and the bar.
export const Logo = () => {
  return (
    <Text as="span" textStyle="logo" css={{ viewTransitionName: "logo" }}>
      tv<chakra.span color="accent.fg">/</chakra.span>explorer
    </Text>
  );
};
