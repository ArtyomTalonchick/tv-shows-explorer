import type { ReactNode } from "react";
import type { IconName } from "~/lib/ui-kit/Icon/Icon";

export type StateMessageProps = {
    icon: IconName;
    title: ReactNode;
    text: string;
    action?: ReactNode;
    tone?: "neutral" | "error";
};

type UsePresenterResult = Omit<StateMessageProps, "tone"> & {
    tone: NonNullable<StateMessageProps["tone"]>;
    // An error is announced to screen readers as soon as it appears.
    role: "alert" | undefined;
};

export const usePresenter = ({ tone = "neutral", ...rest }: StateMessageProps): UsePresenterResult => {
    return {
        ...rest,
        tone,
        role: tone === "error" ? "alert" : undefined,
    };
};
