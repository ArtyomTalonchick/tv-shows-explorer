import { chakra, Menu, Portal, Text } from "@chakra-ui/react";
import type { FC } from "react";
import { Icon } from "~/lib/ui-kit/Icon/Icon";
import { usePresenter } from "./_logic/usePresenter";

// .user-menu of design/library: the signed-in user in the header, an avatar with the first letter on every screen. A
// press opens the full email and «Sign out»; Chakra's menu closes it on Escape and on a press outside.
export const UserMenu: FC = () => {
    const { email, initial, onSignOut } = usePresenter();

    return (
        <Menu.Root positioning={{ placement: "bottom-end", gutter: 8 }}>
            <Menu.Trigger
                aria-label={email}
                display="inline-flex"
                flex="none"
                p="1"
                borderWidth="1px"
                borderColor="border"
                rounded="full"
                bg="bg.glass"
                color="fg"
                backdropFilter="blur({blurs.glass})"
                cursor="pointer"
                transitionProperty="background, border-color"
                transitionDuration="fast"
                transitionTimingFunction="standard"
                focusVisibleRing="none"
                _focusVisible={{ outline: "3px solid", outlineColor: "accent.solid", outlineOffset: "3px" }}
                _hover={{ borderColor: "fg.subtle", bg: "bg.muted" }}
                _expanded={{ borderColor: "fg.subtle", bg: "bg.muted" }}
            >
                <chakra.span
                    aria-hidden="true"
                    display="grid"
                    placeItems="center"
                    boxSize="8"
                    flex="none"
                    rounded="full"
                    bg="fg"
                    color="bg"
                    fontSize="sm"
                    fontWeight="extrabold"
                    textTransform="uppercase"
                >
                    {initial}
                </chakra.span>
            </Menu.Trigger>
            <Portal>
                <Menu.Positioner zIndex="popover">
                    <Menu.Content
                        w="max-content"
                        minW="menu"
                        maxW="min({sizes.menuMax}, 100vw - 2 * {spacing.4})"
                        p="2"
                        borderWidth="1px"
                        borderColor="border"
                        rounded="md"
                        bg="bg.subtle"
                        boxShadow="overlay"
                    >
                        <chakra.div px="3" pt="2" pb="3" mb="2" borderBottomWidth="1px" borderColor="border">
                            <Text textStyle="eyebrow" color="fg.subtle">
                                Signed in as
                            </Text>
                            <Text mt="2" fontWeight="semibold" overflowWrap="anywhere">
                                {email}
                            </Text>
                        </chakra.div>
                        <Menu.Item
                            value="sign-out"
                            onSelect={onSignOut}
                            gap="3"
                            px="3"
                            py="2"
                            rounded="sm"
                            color="fg"
                            fontSize="sm"
                            fontWeight="semibold"
                            cursor="pointer"
                            _highlighted={{ bg: "bg.muted" }}
                        >
                            <Icon name="log-out" boxSize="4" color="fg.muted" />
                            Sign out
                        </Menu.Item>
                    </Menu.Content>
                </Menu.Positioner>
            </Portal>
        </Menu.Root>
    );
};
