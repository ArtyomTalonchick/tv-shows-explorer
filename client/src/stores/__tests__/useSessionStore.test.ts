import { act, renderHook } from "@testing-library/react";
import type { SessionResponse } from "@tv-shows-explorer/shared";
import { useIsSignedIn, useSessionStore } from "../useSessionStore";

const SESSION: SessionResponse = {
    accessToken: "access",
    refreshToken: "refresh",
    user: { id: "u1", email: "anna@example.com" },
};

describe("useIsSignedIn", () => {
    beforeEach(() => {
        useSessionStore.setState({ session: null });
    });

    it("tells a guest from a signed-in user and follows the session", () => {
        const { result } = renderHook(() => useIsSignedIn());
        expect(result.current).toBe(false);

        act(() => useSessionStore.setState({ session: SESSION }));
        expect(result.current).toBe(true);

        act(() => useSessionStore.setState({ session: null }));
        expect(result.current).toBe(false);
    });
});
