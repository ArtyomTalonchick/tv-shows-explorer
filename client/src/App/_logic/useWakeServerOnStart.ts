import { useEffect } from "react";
import { wakeServer } from "./_tasks/wakeServer";

// Wakes the server once, on start, after the first render: by the time the user types a query it is warm. Nothing is
// shown, whatever the answer.
export const useWakeServerOnStart = (): void => {
    useEffect(() => {
        const controller = new AbortController();
        void wakeServer(controller.signal);

        return () => controller.abort();
    }, []);
};
