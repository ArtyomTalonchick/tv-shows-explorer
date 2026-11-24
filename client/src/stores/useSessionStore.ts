import type { SessionResponse } from "@tv-shows-explorer/shared";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type SessionState = {
    // The signed-in user and their tokens; `null` for a guest. Kept in the browser's storage, so a reload keeps it.
    session: SessionResponse | null;
};

export const useSessionStore = create<SessionState>()(
    persist((): SessionState => ({ session: null }), { name: "tv-shows-explorer:session" }),
);

// Whether a user is signed in: the store's own reading of its data, for every Presenter that asks it.
export const useIsSignedIn = (): boolean => useSessionStore(({ session }) => session !== null);
