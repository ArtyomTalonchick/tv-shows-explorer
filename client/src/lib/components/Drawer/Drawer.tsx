import { Box, chakra, Drawer as ChakraDrawer, Portal, Text } from "@chakra-ui/react";
import type { FC } from "react";
import { Icon } from "@/lib/components/Icon/Icon";
import { usePresenter, type DrawerProps } from "./_logic/usePresenter";

export type { DrawerProps } from "./_logic/usePresenter";

// .drawer of design/library: a panel from the right edge over a dimmed page, sizes.drawer wide, the full width on a
// phone. Chakra's drawer keeps the focus inside it and closes it on the backdrop and on Escape.
export const Drawer: FC<DrawerProps> = (props) => {
    const { open, onOpenChange, persistentElements, eyebrow, title, count, closeLabel, children } = usePresenter(props);

    return (
        <ChakraDrawer.Root
            open={open}
            onOpenChange={onOpenChange}
            persistentElements={persistentElements}
            placement="end"
        >
            <Portal>
                <ChakraDrawer.Backdrop bg="bg.scrim" zIndex="overlay" />
                <ChakraDrawer.Positioner zIndex="overlay">
                    <ChakraDrawer.Content
                        w="full"
                        maxW="drawer"
                        h="full"
                        borderLeftWidth="1px"
                        borderColor="border"
                        bg="bg.subtle"
                        boxShadow="overlay"
                    >
                        <ChakraDrawer.Header
                            display="flex"
                            alignItems="flex-start"
                            justifyContent="space-between"
                            gap="4"
                            p="6"
                            borderBottomWidth="1px"
                            borderColor="border"
                        >
                            <Box>
                                <Text textStyle="eyebrow">{eyebrow}</Text>
                                <ChakraDrawer.Title
                                    mt="2"
                                    fontSize="2xl"
                                    fontWeight="extrabold"
                                    letterSpacing="tight"
                                    lineHeight="tight"
                                >
                                    {title}{" "}
                                    <chakra.span color="fg.subtle" fontWeight="semibold">
                                        {count}
                                    </chakra.span>
                                </ChakraDrawer.Title>
                            </Box>
                            <ChakraDrawer.CloseTrigger
                                aria-label={closeLabel}
                                position="static"
                                display="grid"
                                placeItems="center"
                                boxSize="10"
                                flex="none"
                                rounded="full"
                                bg="bg.muted"
                                color="fg.muted"
                                cursor="pointer"
                                transition="background {durations.fast} {easings.standard}, color {durations.fast} {easings.standard}"
                                focusVisibleRing="none"
                                _focusVisible={{ outline: "3px solid", outlineColor: "accent.solid" }}
                                _hover={{ bg: "border", color: "fg" }}
                            >
                                <Icon name="close" boxSize="5" />
                            </ChakraDrawer.CloseTrigger>
                        </ChakraDrawer.Header>
                        <ChakraDrawer.Body flex="1" minH="0" display="flex" flexDirection="column" p="3">
                            {children}
                        </ChakraDrawer.Body>
                    </ChakraDrawer.Content>
                </ChakraDrawer.Positioner>
            </Portal>
        </ChakraDrawer.Root>
    );
};
