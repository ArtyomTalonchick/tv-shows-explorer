import { Flex } from "@chakra-ui/react";
import type { FC, ReactNode } from "react";

type TopBarProps = {
    // The logo, and on the start screen the account block after it.
    children: ReactNode;
};

// .top of design/v0.3: the row over the start and the sign-in pages. It is as tall as the header's controls, so the
// logo stands at the same point with them and without them.
export const TopBar: FC<TopBarProps> = ({ children }) => {
    return (
        <Flex
            position="absolute"
            top="6"
            insetInline="0"
            px={{ base: "4", md: "12" }}
            zIndex="3"
            alignItems="center"
            justifyContent="space-between"
            gap="3"
            // A glass button of the header: its 24px content, the padding and the 1px border; the avatar is as tall.
            minH="calc({spacing.6} + 2 * {spacing.2} + 2px)"
        >
            {children}
        </Flex>
    );
};
