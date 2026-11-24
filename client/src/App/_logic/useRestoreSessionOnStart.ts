import { useEffect } from "react";
import { refreshSession } from "~/tasks/session/refreshSession";

// Refreshes the kept session once, on start. Until the answer the user is shown as signed in from the browser's
// storage; a refused token then makes them a guest, and a failure leaves them signed in, with no toast.
export const useRestoreSessionOnStart = (): void => {
    useEffect(() => {
        const controller = new AbortController();
        void refreshSession(controller.signal);

        return () => controller.abort();
    }, []);
};
