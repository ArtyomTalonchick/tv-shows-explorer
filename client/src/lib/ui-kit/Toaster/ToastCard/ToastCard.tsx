import { chakra, Toast, type HTMLChakraProps } from "@chakra-ui/react";
import type { FC } from "react";
import { Link as RouterLink } from "react-router";
import { Icon } from "~/lib/ui-kit/Icon/Icon";
import type { ToastMeta } from "~/lib/toast/showToast";
import { usePresenter, type ToastCardProps } from "./_logic/usePresenter";
import { ToastAction } from "./ToastAction/ToastAction";

export type { ToastCardProps } from "./_logic/usePresenter";

const TONE_STYLES = {
    accent: { color: "accent.fg", css: { "& svg": { fill: "currentColor" } } },
    muted: { color: "fg.muted" },
} satisfies Record<ToastMeta["tone"], HTMLChakraProps<"span">>;

// .toast of design/library: an icon, one line of text and an optional action, such as Undo, or a link to a page,
// such as «Sign in».
export const ToastCard: FC<ToastCardProps> = (props) => {
    const { text, icon, tone, actionLabel, link } = usePresenter(props);

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
            {actionLabel && <ToastAction>{actionLabel}</ToastAction>}
            {link && (
                <ToastAction asChild>
                    <RouterLink to={link.to}>{link.label}</RouterLink>
                </ToastAction>
            )}
        </Toast.Root>
    );
};
