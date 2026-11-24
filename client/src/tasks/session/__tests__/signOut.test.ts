import type { SessionResponse } from "@tv-shows-explorer/shared";
import { useSessionStore } from "~/stores/useSessionStore";
import { signOut } from "../signOut";

const SESSION: SessionResponse = {
    accessToken: "access",
    refreshToken: "refresh",
    user: { id: "u1", email: "anna@example.com" },
};

describe("signOut", () => {
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it("forgets the session and sends no request", () => {
        const fetchMock = vi.fn();
        vi.stubGlobal("fetch", fetchMock);
        useSessionStore.setState({ session: SESSION });

        signOut();

        expect(useSessionStore.getState().session).toBeNull();
        expect(fetchMock).not.toHaveBeenCalled();
    });
});
