import { useSessionStore } from "~/App/_stores/useSessionStore";

// Signs the user out on this device: the session is forgotten at once, with no request, and the page is a guest's.
export const signOut = (): void => {
    useSessionStore.setState({ session: null });
};
