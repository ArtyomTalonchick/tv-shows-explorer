import type { ReactNode } from "react";
import type { IconName } from "~/lib/ui-kit/Icon/Icon";
import { toaster } from "./toaster";

// A link at the end of the toast, to a page of the app: a press opens the page and closes the toast. `state` goes
// into the history entry of the page, for the page to read.
export type ToastLink = { label: string; to: string; state?: unknown };

export type ToastMeta = {
    icon: IconName;
    // `accent` fills the icon in the accent (.toast--added); `muted` draws it as a grey line.
    tone: "accent" | "muted";
    link: ToastLink | null;
};

export type ShowToastOptions = Omit<ToastMeta, "link"> & {
    text: ReactNode;
    // A button at the end of the toast, e.g. Undo or Retry; a press also closes the toast.
    action?: { label: string; onClick: () => void };
    // A link in place of the action, e.g. «Sign in».
    link?: ToastLink;
    // Read out at once by screen readers, not when they are idle.
    urgent?: boolean;
};

// Shows a toast of design/library through the app's <Toaster />.
export const showToast = ({ text, icon, tone, action, link, urgent = false }: ShowToastOptions): void => {
    const meta: ToastMeta = { icon, tone, link: link ?? null };
    toaster.create({ description: text, type: urgent ? "error" : "info", action, meta });
};
