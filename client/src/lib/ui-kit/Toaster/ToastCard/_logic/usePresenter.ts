import type { ToastOptions } from "@chakra-ui/react";
import type { ReactNode } from "react";
import type { IconName } from "~/lib/ui-kit/Icon/Icon";
import type { ToastMeta } from "~/lib/toast/showToast";

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
};

export const usePresenter = ({ toast }: ToastCardProps): UsePresenterResult => {
    const meta = (toast.meta ?? { icon: "bookmark", tone: "muted" }) as ToastMeta;

    return {
        text: toast.description,
        icon: meta.icon,
        tone: meta.tone,
        actionLabel: toast.action?.label ?? null,
    };
};
