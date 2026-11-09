import { Icon as ChakraIcon } from "@chakra-ui/react";
import { usePresenter, type IconProps } from "./usePresenter";

export type { IconName, IconProps } from "./usePresenter";

// An icon of the design/library sprite. The attributes are the sprite's contract: 24x24, a line in currentColor.
export const Icon = (props: IconProps) => {
  const { href, rest } = usePresenter(props);

  return (
    <ChakraIcon {...rest}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <use href={href} />
      </svg>
    </ChakraIcon>
  );
};
