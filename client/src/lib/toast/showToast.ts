import type { ReactNode } from "react";
import type { IconName } from "~/lib/ui-kit/Icon/Icon";
import { toaster } from "./toaster";

export type ToastMeta = {
    icon: IconName;
    // `accent` fills the icon in the accent (.toast--added); `muted` draws it as a grey line.
    tone: "accent" | "muted";
};

export type ShowToastOptions = ToastMeta & {
    text: ReactNode;
    // A button at the end of the toast, e.g. Undo or Retry; a press also closes the toast.
    action?: { label: string; onClick: () => void };
    // Read out at once by screen readers, not when they are idle.
    urgent?: boolean;
};

// Shows a toast of design/library through the app's <Toaster />.
export const showToast = ({ text, icon, tone, action, urgent = false }: ShowToastOptions): void => {
    const meta: ToastMeta = { icon, tone };
    toaster.create({ description: text, type: urgent ? "error" : "info", action, meta });
};
