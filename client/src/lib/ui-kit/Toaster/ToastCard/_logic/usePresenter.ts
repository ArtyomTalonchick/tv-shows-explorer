import type { ToastOptions } from "@chakra-ui/react";
import type { ReactNode } from "react";
import type { IconName } from "~/lib/ui-kit/Icon/Icon";
import type { ToastLink, ToastMeta } from "~/lib/toast/showToast";

export type ToastCardProps = {
    // A toast as `showToast` made it.
    toast: ToastOptions;
};

type UsePresenterResult = {
    text: ReactNode;
    icon: IconName;
    tone: ToastMeta["tone"];
    // The label of the action button, or nothing when the toast has none.
    actionLabel: string | null;
    // The link to a page in place of the action, or nothing when the toast has none.
    link: ToastLink | null;
};

const NO_META: ToastMeta = { icon: "bookmark", tone: "muted", link: null };

export const usePresenter = ({ toast }: ToastCardProps): UsePresenterResult => {
    const meta = (toast.meta ?? NO_META) as ToastMeta;

    return {
        text: toast.description,
        icon: meta.icon,
        tone: meta.tone,
        actionLabel: toast.action?.label ?? null,
        link: meta.link,
    };
};
