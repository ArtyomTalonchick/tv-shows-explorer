import { chakra, Toast, type HTMLChakraProps } from "@chakra-ui/react";
import type { FC } from "react";
import { Icon } from "~/lib/ui-kit/Icon/Icon";
import type { ToastMeta } from "~/lib/toast/showToast";
import { usePresenter, type ToastCardProps } from "./_logic/usePresenter";

export type { ToastCardProps } from "./_logic/usePresenter";

const TONE_STYLES = {
    accent: { color: "accent.fg", css: { "& svg": { fill: "currentColor" } } },
    muted: { color: "fg.muted" },
} satisfies Record<ToastMeta["tone"], HTMLChakraProps<"span">>;

// .toast of design/library: an icon, one line of text and an optional action, such as Undo.
export const ToastCard: FC<ToastCardProps> = (props) => {
    const { text, icon, tone, actionLabel } = usePresenter(props);

    return (
        <Toast.Root
            display="flex"
            alignItems="center"
            gap="3"
            w="max-content"
            maxW="full"
            minH="12"
            py="3"
            pl="4"
            pr="3"
            borderWidth="1px"
            borderColor="border"
            rounded="md"
            bg="bg.muted"
            color="fg"
            boxShadow="overlay"
            fontSize="sm"
        >
            <chakra.span display="inline-flex" flex="none" {...TONE_STYLES[tone]}>
                <Icon name={icon} boxSize="4" />
            </chakra.span>
            <Toast.Description minW="0" fontSize="sm" opacity="1" css={{ "& b": { fontWeight: "bold" } }}>
                {text}
            </Toast.Description>
            {actionLabel && (
                <Toast.ActionTrigger
                    flex="none"
                    ml="2"
                    h="auto"
                    px="2"
                    py="1"
                    border="0"
                    rounded="sm"
                    bg="transparent"
                    color="accent.fg"
                    fontSize="sm"
                    fontWeight="bold"
                    cursor="pointer"
                    transition="background {durations.fast} {easings.standard}"
                    _hover={{ bg: "border" }}
                >
                    {actionLabel}
                </Toast.ActionTrigger>
            )}
        </Toast.Root>
    );
};
